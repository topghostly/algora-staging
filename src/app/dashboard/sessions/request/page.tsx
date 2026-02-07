import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createSessionRequest } from "@/app/actions/request";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

async function getTutors() {
  return await prisma.user.findMany({
    where: { role: "TUTOR" },
    select: { id: true, name: true, email: true },
  });
}

export default async function RequestSessionPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { subscriptionTier: true, credits1on1: true },
  });

  const tutors = await getTutors();
  if (!user) redirect("/auth/signin");

  if (user.credits1on1 < 1) {
    return (
      <>
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Request a 1-on-1 Session</h1>
            <div className="bg-muted/50 px-4 py-2 rounded-lg text-sm">
              <span className="text-muted-foreground mr-2">Your Plan:</span>
              <span className="font-semibold mr-4">
                {user.subscriptionTier}
              </span>
              <span className="text-muted-foreground mr-2">
                1-on-1 Credits:
              </span>
              <span className="font-semibold">{user.credits1on1}</span>
            </div>
          </div>
        </div>
        <div className="h-[70vh] w-full flex items-center justify-center">
          <div className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-8" />
            <h3 className="text-2xl font-semibold mb-2">No credits left</h3>
            <p className="text-muted-foreground mb-3">
              You have no credits left to request a 1-on-1 session.
            </p>
            <Link href="/pricing" className="btn btn-primary">
              Upgrade your plan
            </Link>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Request a 1-on-1 Session</h1>
        <div className="bg-muted/50 px-4 py-2 rounded-lg text-sm">
          <span className="text-muted-foreground mr-2">Your Plan:</span>
          <span className="font-semibold mr-4">{user.subscriptionTier}</span>
          <span className="text-muted-foreground mr-2">1-on-1 Credits:</span>
          <span className="font-semibold">{user.credits1on1}</span>
        </div>
      </div>
      <Link
        href="/dashboard/sessions"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} />
        Back to Sessions
      </Link>

      <div className="bg-card overflow-hidden max-w-2xl mx-auto">
        {/* <div className="p-6 ">
          <h1 className="text-2xl font-bold">Request a 1-on-1 Session</h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details below to request a session with a tutor.
          </p>
        </div> */}

        <form action={createSessionRequest} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold" htmlFor="tutorId">
              Select Tutor
            </label>
            <select
              id="tutorId"
              name="tutorId"
              required
              className="w-full h-10 px-3 py-2 bg-background border rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a tutor...</option>
              {tutors.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.name || tutor.email}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold" htmlFor="title">
              Session Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g., Help with React Tables"
              className="w-full h-10 px-3 py-2 bg-background border rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold" htmlFor="preferredDate">
                Preferred Date
              </label>
              <input
                id="preferredDate"
                name="preferredDate"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full h-10 px-3 py-2 bg-background border rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold" htmlFor="preferredTime">
                Preferred Time
              </label>
              <input
                id="preferredTime"
                name="preferredTime"
                type="time"
                required
                className="w-full h-10 px-3 py-2 bg-background border rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold" htmlFor="message">
              Message (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Tell the tutor what you'd like to cover..."
              className="w-full min-h-[100px] px-3 py-2 bg-background border rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full py-6 text-base"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
