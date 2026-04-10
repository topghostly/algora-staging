import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Loader, Video } from "lucide-react";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

async function getUserBookings(userId: string) {
  return await prisma.sessionEnrollment.findMany({
    where: {
      userId,
      session: {
        status: { notIn: ["COMPLETED", "CANCELLED"] },
      },
    },
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
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  return await prisma.sessionRequest.findMany({
    where: {
      studentId: userId,
      OR: [
        { status: "PENDING" },
        { status: "REJECTED", updatedAt: { gte: twoWeeksAgo } },
      ],
    },
    include: {
      tutor: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader size={23} className="animate-spin text-muted-foreground" />
    </div>
  );
}

async function RequestsSection({ userId }: { userId: string }) {
  let requests = null;
  try {
    requests = await getUserSessionRequests(userId);
  } catch {
    return (
      <div className="my-10">
        <ErrorState message="We couldn't load your session requests at this time. Please try again." />
      </div>
    );
  }

  if (requests.length === 0) return null;

  return (
    <div className="mb-1">
      <h3 className="text-xl font-medium mb-6">One-on-One Sessions</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {requests.map((request) => (
          <div
            key={request.id}
            className=" p-5 border rounded-lg border-input flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="">{request.title}</h4>
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
              <p className="mt-3 text-[11px] text-red-600 bg-red-50 p-2 rounded w-fit">
                This request was rejected. Your credit has been refunded.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

async function BookingsSection({ userId }: { userId: string }) {
  let bookings = null;
  try {
    bookings = await getUserBookings(userId);
  } catch {
    return (
      <div className="my-10">
        <ErrorState message="We couldn't load your bookings at this time. Please try again." />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="mt-10">
        <h3 className="text-xl font-medium mb-6">Group Sessions Overview</h3>

        <div className="h-[40vh] w-full flex items-center justify-center">
          <div className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-8" />
            <h3 className="text-2xl font-medium mb-2">
              No Group sessions available
            </h3>
            <p className="text-muted-foreground mb-3">
              You haven't any upcoming group sessions.
            </p>
            <Link href="/dashboard/sessions/browse">
              <Button variant="default">Find a group session</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h3 className="text-xl font-medium mb-6">Group Sessions Overview</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="p-5 border rounded-lg border-input flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="">{booking.session.title}</h4>
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

            <div className="flex-col gap-2 flex text-muted-foreground">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-muted-foreground" />
                <span>
                  {new Date(booking.session.startTime).toLocaleDateString()} at{" "}
                  {new Date(booking.session.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {booking.session.meetingLink && (
                <a
                  href={booking.session.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4"
                >
                  <Button variant="outline" size={"sm"}>
                    <Video size={15} />
                    <p className="text-[12px]">Join Meeting</p>
                  </Button>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function LearnerSessionsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const userId = session.user.id;

  return (
    <div className="container px-page">
      <BreadcrumbNav
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Sessions" },
        ]}
        className="my-16 "
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

      <Suspense fallback={<SectionLoader />}>
        <RequestsSection userId={userId} />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <BookingsSection userId={userId} />
      </Suspense>
    </div>
  );
}
