import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Video } from "lucide-react";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/button";

async function getUserBookings(userId: string) {
  return await prisma.sessionEnrollment.findMany({
    where: { userId },
    include: {
      session: {
        include: {
          tutor: true,
        },
      },
    },
  });
}

async function getUserSessionRequests(userId: string) {
  return await prisma.sessionRequest.findMany({
    where: {
      studentId: userId,
      status: {
        in: ["PENDING", "REJECTED"],
      },
    },
    include: {
      tutor: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export default async function LearnerSessionsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  let bookings = null;
  let requests = null;
  try {
    [bookings, requests] = await Promise.all([
      getUserBookings(session.user.id),
      getUserSessionRequests(session.user.id),
    ]);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    // bookings and requests remain null
  }

  const bookingsAvailable = !!bookings;
  const requestsAvailable = !!requests;

  return (
    <div className="container">
      <BreadcrumbNav
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Sessions" },
        ]}
        className="mt-8 -mb-12"
      />
      <div className="block md:flex items-center justify-between my-16">
        <h1 className="text-3xl font-medium mb-10 md:mb-0">My Sessions</h1>
        <div className="flex sm:flex-row flex-col sm:gap-5 gap-2">
          <Link href="/dashboard/sessions/browse">
            <Button>Browse Available Sessions</Button>
          </Link>
          <Link href="/dashboard/sessions/request">
            <Button variant="outline">Request a 1-on-1 session</Button>
          </Link>
        </div>
      </div>

      {!bookings || !requests ? (
        <div className="my-10">
          <ErrorState message="We couldn't load your sessions at this time. Please try again." />
        </div>
      ) : (
        <>
          {requests.length > 0 && (
            <div className="mb-1">
              <h3 className="text-xl font-medium mb-6 ">
                One-on-One Sessions Overview
              </h3>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="card p-5 border-l-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{request.title}</h4>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            request.status === "PENDING"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        with {request.tutor.name || request.tutor.email}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={14} />
                        <span>
                          {request.preferredDate} at {request.preferredTime}
                        </span>
                      </div>
                    </div>
                    {request.status === "REJECTED" && (
                      <p className="mt-3 text-[11px] text-red-600 bg-red-50 p-2 rounded">
                        This request was rejected. Your credit has been
                        refunded.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {bookings.length === 0 ? (
            <div className="h-[40vh] w-full flex items-center justify-center">
              <div className="text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-8" />
                <h3 className="text-2xl font-medium mb-2">
                  No sessions booked
                </h3>
                <p className="text-muted-foreground mb-3">
                  You haven't booked any mentorship sessions yet.
                </p>
                <Link href="/dashboard/sessions/browse">
                  <Button variant="default">Find a group session</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <div key={booking.id} className="card p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {booking.session.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        with {booking.session.tutor.name || "Algora Tutor"}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full inline-flex items-center justify-center whitespace-nowrap ${
                        booking.session.type === "ONE_ON_ONE"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {booking.session.type.replace("_", " ")}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-muted-foreground" />
                      <span>
                        {new Date(
                          booking.session.startTime,
                        ).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(booking.session.startTime).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                    {booking.session.meetingLink && (
                      <a
                        // className="flex items-center gap-2 text-sm text-white bg-blue-600 btn mt-6 h-[40px]"
                        href={booking.session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Video size={16} />
                        <p className="text-white">Join Meeting</p>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
