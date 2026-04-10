"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

type SessionInfo = {
  id: string;
  title: string;
  status: string;
  startTime: string;
  endTime: string;
};

type ViewState =
  | { kind: "loading" }
  | { kind: "invalid"; message: string }
  | { kind: "already-processed"; status: string }
  | { kind: "ready"; session: SessionInfo }
  | { kind: "submitting" }
  | { kind: "done"; status: "COMPLETED" | "CANCELLED" }
  | { kind: "error"; message: string };

export default function ConfirmAttendancePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const token = searchParams.get("token");
  const prefillAttended = searchParams.get("attended");

  const [view, setView] = useState<ViewState>({
    kind: "loading",
  });

  useEffect(() => {
    if (!id || !token) {
      setView({
        kind: "invalid",
        message: "This link is missing required parameters.",
      });
      return;
    }

    fetch(
      `/api/session/confirm-attendance?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`,
    )
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setView({
            kind: "invalid",
            message: data.error ?? "This link is invalid or has expired.",
          });
          return;
        }
        const session: SessionInfo = data.session;
        if (session.status !== "PENDING") {
          setView({ kind: "already-processed", status: session.status });
          return;
        }

        // If the email button had attended=true/false pre-filled, auto-submit
        if (prefillAttended === "true" || prefillAttended === "false") {
          submit(session, prefillAttended === "true");
        } else {
          setView({ kind: "ready", session });
        }
      })
      .catch(() =>
        setView({
          kind: "error",
          message: "Something went wrong. Please try again.",
        }),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(session: SessionInfo, attended: boolean) {
    setView({ kind: "submitting" });
    try {
      const res = await fetch("/api/session/confirm-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: session.id, token, attended }),
      });
      const data = await res.json();

      if (!res.ok) {
        setView({
          kind: "error",
          message: data.error ?? "Failed to save your response.",
        });
        return;
      }

      if (data.alreadyProcessed) {
        setView({ kind: "already-processed", status: data.status });
        return;
      }

      setView({ kind: "done", status: attended ? "COMPLETED" : "CANCELLED" });
    } catch {
      setView({
        kind: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8">
        <div className="flex justify-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-n.png" alt="Algora" width={60} height={60} />
        </div>

        {view.kind === "loading" && (
          <div className="text-center text-gray-500 flex items-center justify-center gap-2">
            <Loader size={18} className="animate-spin" /> Verifying link…
          </div>
        )}

        {view.kind === "submitting" && (
          <div className="text-center text-gray-500 flex items-center justify-center gap-2">
            <Loader size={18} className="animate-spin" /> Saving your response…
          </div>
        )}

        {view.kind === "invalid" && (
          <div className="text-center">
            <h1 className="text-gray-900 mb-2">Invalid Link</h1>
            <p className="text-red-500">{view.message}</p>
          </div>
        )}

        {view.kind === "error" && (
          <div className="text-center">
            <h1 className="text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-red-500">{view.message}</p>
          </div>
        )}

        {view.kind === "already-processed" && (
          <div className="text-center">
            <h1 className="text-gray-900 mb-2">Already Confirmed</h1>
            <p className="text-gray-500">
              This session has already been marked as{" "}
              <span className="font-medium">
                {view.status === "COMPLETED" ? "completed" : "cancelled"}
              </span>
              .
            </p>
          </div>
        )}

        {view.kind === "ready" && (
          <>
            <h2 className="text-gray-900 text-center mb-1">Session Check-In</h2>
            <p className="text-gray-500 text-center mb-6">
              Did your session take place?
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
              <p className=" text-gray-900 mb-1">{view.session.title}</p>
              <p className="text-sm text-gray-400">
                {new Date(view.session.startTime).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                &middot;{" "}
                {new Date(view.session.startTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => submit(view.session, true)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white transition-colors"
              >
                Yes, it happened
              </Button>
              <Button
                onClick={() => submit(view.session, false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700  transition-colors"
              >
                No, it didn&apos;t happen
              </Button>
            </div>
          </>
        )}

        {view.kind === "done" && (
          <div className="text-center">
            <h2 className="text-gray-900 mb-2">
              {view.status === "COMPLETED"
                ? "Session Marked Complete"
                : "Session Cancelled"}
            </h2>
            <p className="text-gray-500">
              {view.status === "COMPLETED"
                ? "Your session record has been updated. Thank you!"
                : "Your session has been marked as cancelled. Thank you for letting us know."}
            </p>
            <div
              className={`inline-flex items-center justify-center w-14 h-14 rounded-full mt-4 ${
                view.status === "COMPLETED"
                  ? "bg-teal-50 text-teal-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {view.status === "COMPLETED" ? (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
