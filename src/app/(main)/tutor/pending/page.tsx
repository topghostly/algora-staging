"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Clock, Loader, Mail, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { LottieAnimation } from "@/components/NotFoundAnimation";

export default function TutorPendingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      if (session.user.role !== "TUTOR") {
        router.replace("/dashboard");
        return;
      }
      // Approved tutors should not be here
      if (session.user.tutorStatus === "APPROVED") {
        router.replace("/tutor");
      }
    }
  }, [status, session, router]);

  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /> */}
        <Loader className="animate-spin" />
      </div>
    );
  }

  const isRejected = session.user.tutorStatus === "REJECTED";

  return (
    <div className="min-h-[50vh] bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full flex flex-col items-center gap-4 text-center">
        <div
        // className={`w-20 h-20 rounded-full flex items-center justify-center ${
        //   isRejected ? "bg-destructive/10" : "bg-primary/10"
        // }`}
        >
          {isRejected ? (
            <div className="flex mx-auto h-60 w-60 md:h-72 md:w-72 items-center justify-center overflow-hidden">
              <LottieAnimation
                jsonPath="/json/reject.json"
                fallbackWebm="/videos/empty.webm"
              />
            </div>
          ) : (
            <div className="flex mx-auto h-60 w-60 md:h-72 md:w-72 items-center justify-center overflow-hidden scale-180">
              <LottieAnimation
                jsonPath="/json/pending_cat.json"
                fallbackWebm="/videos/empty.webm"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="tracking-tight">
            {isRejected
              ? "Application Not Approved"
              : "Application Under Review"}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {isRejected ? (
              <>
                After reviewing your application, we were unable to approve your
                tutor account at this time. If you believe this is an error or
                would like more information, please reach out to our team.
              </>
            ) : (
              <>
                Your credentials are currently being vetted by our team. You
                will receive an email response within{" "}
                <strong className="">3 working days</strong>.
              </>
            )}
          </p>
        </div>
        <div>
          <p>
            {" "}
            <span>
              Questions? Email us at{" "}
              <a
                href="mailto:support@joinalgora.com"
                className="text-primary underline underline-offset-2"
              >
                support@joinalgora.com
              </a>
            </span>
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
