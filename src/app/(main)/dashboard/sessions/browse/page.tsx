import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { bookSession } from "@/app/(main)/actions/booking";
import Link from "next/link";
import { Calendar, CircleAlert, Clock, User } from "lucide-react";
import { LottieAnimation } from "@/components/NotFoundAnimation";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { ErrorState } from "@/components/ErrorState";
import { SubmitButton } from "./SubmitButton";
import { Button } from "@/components/ui/button";

async function getAvailableSessions(userId: string) {
  const sessions = await prisma.tutorSession.findMany({
    where: {
      type: "GROUP",
      startTime: {
        gt: new Date(),
      },
    },
    include: {
      tutor: {
        select: { name: true },
      },
      sessionEnrollments: {
        select: { userId: true },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });
  // Filter out sessions where:
  // 1. User already booked
  // 2. 1-on-1 is full
  return sessions.filter((session) => {
    const isBookedByUser = session.sessionEnrollments.some(
      (b) => b.userId === userId,
    );
    // const isFull =
    //   session.type === "ONE_ON_ONE" && session.sessionEnrollments.length >= 1;
    return !isBookedByUser;
    // return !isBookedByUser && !isFull;
  });
}

export default async function BrowseSessionsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  if (session.user.subscriptionTier === "FREE") {
    return (
      <div className="container px-page">
        <BreadcrumbNav
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Sessions", href: "/dashboard/sessions" },
            { label: "Browse" },
          ]}
          className="mt-8 -mb-12"
        />
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center my-16">
          <h1 className="">Request group Session</h1>
          <div className="bg-muted/50 px-4 py-2 rounded-lg text-sm">
            <span className="text-muted-foreground mr-2">Your Plan:</span>
            <span className="font-semibold mr-4">
              {session.user.subscriptionTier}
            </span>
            <span className="text-muted-foreground mr-2">1-on-1 Credits:</span>
            {/* <span className="font-semibold">{session.user.credits1on1}</span> */}
          </div>
        </div>

        <div className="md:h-[60vh] w-full flex items-center justify-center">
          <div className="text-center">
            <div className="flex mx-auto h-60 w-60 md:h-72 md:w-72 items-center justify-center overflow-hidden mb-6">
              <LottieAnimation
                jsonPath="/json/upgrade-algora.json"
                fallbackWebm="/videos/empty.webm"
              />
            </div>
            <h3 className="mb-2">Upgrade to attend sessions</h3>
            <p className="text-muted-foreground mb-3">
              You need to have a paid subscription to browse and attend
              sessions.
            </p>
            <Link href="/pricing">
              <Button variant={"outline"}>Upgrade your plan</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let availableSessions = null;
  let user = null;

  try {
    [availableSessions, user] = await Promise.all([
      getAvailableSessions(session.user.id),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { subscriptionTier: true, credits1on1: true },
      }),
    ]);
  } catch (error) {
    console.error("Error fetching available sessions:", error);
    // Keep them null to trigger ErrorState
  }

  if (!availableSessions || !user) {
    return (
      <div className="container px-page">
        <BreadcrumbNav
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Sessions", href: "/dashboard/sessions" },
            { label: "Browse" },
          ]}
          className="mt-8 -mb-12"
        />
        <div className="my-16">
          <ErrorState message="We couldn't load the available sessions right now. Please try again later." />
        </div>
      </div>
    );
  }

  return (
    <div className="container px-page">
      <BreadcrumbNav
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Sessions", href: "/dashboard/sessions" },
          { label: "Browse" },
        ]}
        className="my-16"
      />
      <div className="flex flex-col md:flex-row gap-6 justify-between md:items-center my-16">
        <h1 className="">Available Sessions</h1>
        <div className="bg-muted/50 px-4 py-2 rounded-lg text-sm w-fit">
          <span className="text-muted-foreground mr-2">Your Plan:</span>
          <span className="font-semibold mr-4">{user.subscriptionTier}</span>
          <span className="text-muted-foreground mr-2">1-on-1 Credits:</span>
          <span className="font-semibold">{user.credits1on1}</span>
        </div>
      </div>

      {availableSessions.length === 0 ? (
        <div className="text-center h-[60vh] flex flex-col items-center justify-center">
          <CircleAlert className="mx-auto h-12 w-12 text-muted-foreground mb-8" />
          <p className="text-muted-foreground text-lg">
            No available sessions at the moment. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableSessions.map((s) => {
            const isGroup = s.type === "GROUP";
            const isOneOnOne = s.type === "ONE_ON_ONE";

            let canBook = true;
            let actionLabel = "Book Session";
            let actionLink = null;

            if (isGroup && user.subscriptionTier === "FREE") {
              canBook = false;
              actionLabel = "Upgrade to Join";
              actionLink = "/pricing";
            } else if (isOneOnOne && user.credits1on1 < 1) {
              canBook = false;
              actionLabel = "Get Credits"; // Or Upgrade if credits come with plans
              actionLink = "/pricing";
            }

            return (
              <div
                key={s.id}
                className="border border-input rounded-lg p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <h3 className="">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {s.tutor.name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm mb-6 flex-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={16} />
                    <span>{new Date(s.startTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={16} />
                    <span>
                      {new Date(s.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -
                      {new Date(s.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User size={16} className="text-muted-foreground" />
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        s.type === "ONE_ON_ONE"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {s.type.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {canBook ? (
                  <form action={bookSession.bind(null, s.id)}>
                    <SubmitButton label={actionLabel} />
                  </form>
                ) : (
                  <Link
                    href={actionLink || "/pricing"}
                    className="btn btn-outline w-full text-center"
                  >
                    {actionLabel}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
