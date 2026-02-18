"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { useSearchParams } from "next/navigation";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
      {loading ? "Creating..." : "Create Session"}
    </button>
  );
}

export default function NewSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    <div className="w-lg mx-auto">
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

      <div className="p-4 bg-card ">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Student Email
            </label>
            <input
              type="email"
              name="studentEmail"
              defaultValue={initialEmail}
              placeholder="student@example.com"
              className="input w-full"
            />
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
              className="input w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Session Type
              </label>
              <select
                name="type"
                className="input w-full"
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
                className="input w-full"
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
                className="input w-full"
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
                className="input w-full"
              />
            </div>
          </div>

          <div className="">
            <SubmitButton loading={loading} />
          </div>
        </form>
      </div>
    </div>
  );
}

// {
//   kind: 'calendar#event',
//   etag: '"3539222778819134"',
//   id: '9ent3g1je2ei9v7q0mbi2vl3r0',
//   status: 'confirmed',
//   htmlLink: 'https://www.google.com/calendar/event?eid=OWVudDNnMWplMmVpOXY3cTBtYmkydmwzcjAgdGVtaXRvcGVhYm9sYWppMDMyN0Bt',
//   created: '2026-01-28T14:43:08.000Z',
//   updated: '2026-01-28T14:43:09.409Z',
//   summary: 'Test Sessions',
//   description: 'Private learning session on Algora',
//   creator: { email: 'temitopeabolaji0327@gmail.com', self: true },
//   organizer: { email: 'temitopeabolaji0327@gmail.com', self: true },
//   start: { dateTime: '2026-01-29T05:45:00+01:00', timeZone: 'Africa/Lagos' },
//   end: { dateTime: '2026-01-29T06:30:00+01:00', timeZone: 'Africa/Lagos' },
//   iCalUID: '9ent3g1je2ei9v7q0mbi2vl3r0@google.com',
//   sequence: 0,
//   attendees: [ { email: 'td.bolaji@gmail.com', responseStatus: 'needsAction' } ],
//   hangoutLink: 'https://meet.google.com/phw-trph-bsm',
//   conferenceData: {
//     createRequest: {
//       requestId: 'algora-1on1-e2834e51-9563-44cc-b8d4-f895b41a2dab',
//       conferenceSolutionKey: [Object],
//       status: [Object]
//     },
//     entryPoints: [ [Object] ],
//     conferenceSolution: {
//       key: [Object],
//       name: 'Google Meet',
//       iconUri: 'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png'
//     },
//     conferenceId: 'phw-trph-bsm'
//   },
//   reminders: { useDefault: true },
//   eventType: 'default'
// }
