import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Video } from "lucide-react";

async function getUserBookings(userId: string) {
  return await prisma.booking.findMany({
    where: { userId },
    include: {
      tutorSession: {
        include: {
          tutor: {
            select: { name: true, email: true },
          },
        },
      },
    },
    orderBy: {
      tutorSession: { startTime: "asc" },
    },
  });
}

export default async function LearnerSessionsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const bookings = await getUserBookings(session.user.id);

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Sessions</h1>
        <Link href="/dashboard/sessions/browse" className="btn btn-primary">
          Browse Available Sessions
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/50">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No sessions booked</h3>
          <p className="text-muted-foreground mb-4">
            You haven't booked any mentorship sessions yet.
          </p>
          <Link
            href="/dashboard/sessions/browse"
            className="text-primary hover:underline"
          >
            Find a mentor
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="card p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {booking.tutorSession.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    with {booking.tutorSession.tutor.name}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full inline-flex items-center justify-center whitespace-nowrap ${
                    booking.tutorSession.type === "ONE_ON_ONE"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {booking.tutorSession.type.replace("_", " ")}
                </span>
              </div>

              <div className="space-y-2 mb-6 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span>
                    {new Date(
                      booking.tutorSession.startTime,
                    ).toLocaleDateString()}{" "}
                    at{" "}
                    {new Date(
                      booking.tutorSession.startTime,
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {booking.tutorSession.meetingLink && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Video size={16} />
                    <a
                      href={booking.tutorSession.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Join Meeting
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t mt-auto">
                <button className="btn btn-outline w-full text-sm">
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
