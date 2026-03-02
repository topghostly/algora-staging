"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { useSearchParams } from "next/navigation";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      className="btn btn-primary w-full rounded-lg"
      disabled={loading}
    >
      {loading ? "Creating..." : "Create Session"}
    </button>
  );
}

export default function NewSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log(searchParams);
  const [loading, setLoading] = useState(false);

  const initialEmail = searchParams.get("studentEmail") || "";
  const initialTitle = searchParams.get("title") || "";
  const initialDate = searchParams.get("preferredDate") || "";
  const initialTime = searchParams.get("preferredTime") || "";
  const requestId = searchParams.get("requestId");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const duration = formData.get("duration") as string;
    const date = formData.get("date") as string;
    const startTimeStr = formData.get("startTime") as string;
    const studentEmail = formData.get("studentEmail") as string;

    if (!title || !type || !duration || !date || !startTimeStr) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      // Calculate start and end times
      const startDateTime = new Date(`${date}T${startTimeStr}`);
      const durationMs = parseInt(duration) * 60 * 1000;
      const endDateTime = new Date(startDateTime.getTime() + durationMs);

      const response = await fetch("/api/session/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          studentEmail,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          type,
          requestId, // Pass requestId to update its status
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (
          response.status === 401 &&
          (result.error?.includes("Calendar not connected") ||
            result.error?.includes("Calendar connection expired"))
        ) {
          toast.error(result.error);
          router.push("/tutor");
          return;
        }
        throw new Error(result.error || "Failed to create session");
      }

      toast.success(
        "Session created successfully and added to Google Calendar!",
      );
      router.push("/tutor/sessions");
      router.refresh();
    } catch (error: any) {
      console.error("Create session error:", error);
      toast.error(
        error.message || "An error occurred while creating the session",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <BreadcrumbNav
        items={[
          { label: "Tutor Dashboard", href: "/tutor" },
          { label: "Sessions", href: "/tutor/sessions" },
          { label: "New Session" },
        ]}
        className="mb-6"
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-medium">Create New Session</h1>
        {/* <Link
          href="/tutor/sessions"
          className="text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Link> */}
      </div>

      <div className="bg-card ">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Student Email
            </label>
            <input
              type="email"
              name="studentEmail"
              defaultValue={initialEmail}
              placeholder="student@example.com"
              className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {!initialEmail && (
              <div className="text-xs text-orange-500 ml-1.5 mt-1">
                For Group Sessions leave blank
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Session Title
            </label>
            <input
              type="text"
              name="title"
              defaultValue={initialTitle}
              required
              placeholder="e.g., Weekly Mentorship Call"
              className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Session Type
              </label>
              <select
                name="type"
                className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                defaultValue="ONE_ON_ONE"
              >
                <option value="ONE_ON_ONE">One-on-One</option>
                <option value="GROUP">Group Session</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Duration (minutes)
              </label>
              <select
                name="duration"
                className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                defaultValue="60"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                name="date"
                defaultValue={initialDate}
                required
                className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                defaultValue={initialTime}
                required
                className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {searchParams.size > 0 && (
            <div className="text-xs text-muted-foreground mt-[-8px]">
              The date and time can be adjusted based on your availability.
            </div>
          )}

          <div className="mt-2">
            <SubmitButton loading={loading} />
          </div>
        </form>
      </div>
    </div>
  );
}
