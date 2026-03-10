import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createSessionRequest } from "@/app/(main)/actions/request";
import Link from "next/link";
import { ArrowLeft, Calendar, Diameter } from "lucide-react";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { SessionRequestForm } from "@/components/SessionRequestForm";
import { ErrorState } from "@/components/ErrorState";

async function getTutors() {
  return await prisma.user.findMany({
    where: { role: "TUTOR" },
    select: {
      id: true,
      name: true,
      email: true,
      specialties: true,
      image: true,
      tutorBio: true,
    },
  });
}

export default async function RequestSessionPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  let user = null;
  let tutors = [];
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionTier: true, credits1on1: true },
    });
    tutors = await getTutors();
  } catch (error) {
    console.error("Error fetching request data:", error);
    return (
      <div className="container py-10">
        <ErrorState message="We couldn't load the request form. Please try again later." />
      </div>
    );
  }

  if (!user) redirect("/auth/signin");

  if (user.credits1on1 < 1) {
    return (
      <>
        <div className="container ">
          <BreadcrumbNav
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Sessions", href: "/dashboard/sessions" },
              { label: "Request" },
            ]}
            className="mt-8 -mb-12"
          />
          <div className="flex justify-between items-center my-16">
            <h1 className="text-3xl font-medium">Request a 1-on-1 Session</h1>
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
            <Diameter className="mx-auto h-12 w-12 text-muted-foreground mb-8" />
            <h3 className="text-2xl font-medium mb-2">
              {!["FREE", "BASIC"].includes(user.subscriptionTier)
                ? "No credits left"
                : "Upgrade your plan"}
            </h3>
            <p className="text-muted-foreground mb-3">
              {!["FREE", "BASIC"].includes(user.subscriptionTier)
                ? "You have no credits left to request a 1-on-1 session."
                : "Upgrade to a PRO plan to get 1-on-1 sessions"}
            </p>
            {["FREE", "BASIC"].includes(user.subscriptionTier) && (
              <Link href="/pricing" className="btn btn-primary">
                Upgrade your plan
              </Link>
            )}
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="container py-10">
      <BreadcrumbNav
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Sessions", href: "/dashboard/sessions" },
          { label: "Request" },
        ]}
        className="mt-8 -mb-12"
      />
      <div className="flex justify-between items-center my-16">
        <h1 className="text-3xl font-medium">Request a 1-on-1 Session</h1>
        <div className="bg-muted/50 px-4 py-2 rounded-lg text-sm">
          <span className="text-muted-foreground mr-2">Your Plan:</span>
          <span className="font-semibold mr-4">{user.subscriptionTier}</span>
          <span className="text-muted-foreground mr-2">1-on-1 Credits:</span>
          <span className="font-semibold">{user.credits1on1}</span>
        </div>
      </div>

      <div className="bg-card overflow-hidden max-w-2xl mx-auto">
        <SessionRequestForm tutors={tutors} />
      </div>
    </div>
  );
}
