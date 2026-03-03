import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Info, Plus, User } from "lucide-react";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { toast } from "sonner";
import SessionDelete from "@/components/sessionDelete";
import { ErrorState } from "@/components/ErrorState";

async function getSessions(userId: string) {
  return await prisma.tutorSession.findMany({
    where: {
      tutorId: userId,
    },
    orderBy: {
      startTime: "asc",
    },
    include: {
      bookings: {
        include: {
          user: true,
        },
      },
    },
  });
}

export default async function TutorSessionsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  let sessions = null;
  let pendingRequestsCount = 0;

  try {
    [sessions, pendingRequestsCount] = await Promise.all([
      getSessions(session.user.id),
      prisma.sessionRequest.count({
        where: {
          tutorId: session.user.id,
          status: "PENDING",
        },
      }),
    ]);
  } catch (error) {
    console.error("Error fetching tutor sessions:", error);
    // Keep them null to trigger ErrorState
  }

  return (
    <div className="flex flex-col gap-6">
      <BreadcrumbNav
        items={[
          { label: "Tutor Dashboard", href: "/tutor" },
          { label: "Sessions" },
        ]}
        className="mb-4"
      />
      <div className="block md:flex items-center justify-between ">
        <h1 className="text-3xl font-medium mb-4 md:mb-0">Your Sessions</h1>
        <div className="flex sm:flex-row flex-col sm:gap-5 gap-2">
          <Link
            href="/tutor/request"
            className="btn btn-outline flex items-center gap-2 relative"
            style={{
              borderRadius: "200px",
            }}
          >
            <User size={16} strokeWidth={3} />
            1-on-1 Request
            <div className="absolute -top-2 right-0">
              {pendingRequestsCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">
                  {pendingRequestsCount}
                </span>
              )}
            </div>
          </Link>
          <Link
            href="/tutor/sessions/new"
            className="btn btn-primary flex items-center gap-2"
            style={{
              borderRadius: "200px",
            }}
          >
            <Plus size={16} strokeWidth={3} />
            Create Session
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {!sessions ? (
          <div className="my-10">
            <ErrorState message="We couldn't load your sessions right now. Please try again." />
          </div>
        ) : sessions.length === 0 ? (
          <div className="h-[50vh] w-full flex items-center justify-center">
            <div className="text-center">
              <Info className="mx-auto h-12 w-12 text-muted-foreground mb-8" />
              <h3 className="text-2xl font-medium mb-2">
                You haven't created any sessions yet.
              </h3>
              <p className="text-muted-foreground mb-3">
                Start your journey by creating a learning path.
              </p>
              <Link href="/tutor/sessions/new" className="btn btn-primary">
                Create your first session
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="card p-4 flex items-center justify-between"
              >
                <div className="flex gap-1 flex-col">
                  <h4>{s.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(s.startTime).toLocaleString()} -{" "}
                    {new Date(s.endTime).toLocaleTimeString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full w-fit ${
                      s.type === "ONE_ON_ONE"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {s.type.replace("_", " ")}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {s.bookings.length} / {s.type === "ONE_ON_ONE" ? 1 : "∞"}{" "}
                    Booked
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="btn btn-outline btn-sm"
                      style={{
                        borderRadius: "8px",
                      }}
                    >
                      Edit
                    </button>
                    <SessionDelete id={s.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
