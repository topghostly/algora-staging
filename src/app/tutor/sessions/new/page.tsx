"use client";

import { createSession } from "@/app/actions/session";
import { useFormStatus } from "react-dom";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary w-full" disabled={pending}>
      {pending ? "Creating..." : "Create Session"}
    </button>
  );
}

export default function NewSessionPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Session</h1>
        <Link
          href="/tutor/sessions"
          className="text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Link>
      </div>

      <div className="card p-6">
        <form action={createSession} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Session Title
            </label>
            <input
              type="text"
              name="title"
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
              <select name="type" className="input w-full" required>
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
                required
                className="input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Meeting Link (Optional)
            </label>
            <input
              type="url"
              name="meetingLink"
              placeholder="https://meet.google.com/..."
              className="input w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              You can add this later if you prefer.
            </p>
          </div>

          <div className="pt-4">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
