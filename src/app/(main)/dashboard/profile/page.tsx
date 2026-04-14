import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Loader } from "lucide-react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SubscriptionCard from "@/components/profile/SubscriptionCard";
import BookingHistory from "@/components/profile/BookingHistory";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import SubscriptionHistory from "@/components/profile/SubscriptionHistory";
import { ErrorState } from "@/components/ErrorState";

// ── Async section components ────────────────────────────────────────────────

async function ProfileSections({ userId }: { userId: string }) {
  let user;
  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        bookings: {
          include: {
            tutorSession: {
              include: {
                tutor: { select: { name: true } },
              },
            },
          },
          orderBy: { tutorSession: { startTime: "desc" } },
          take: 5,
        },
      },
    });
  } catch {
    return <ErrorState message="Failed to load profile data." />;
  }

  if (!user) return <ErrorState message="User not found." />;

  return (
    <>
      <ProfileHeader user={user} />
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <SubscriptionCard
          subscriptionTier={user.subscriptionTier}
          credits1on1={user.credits1on1}
        />
        <BookingHistory bookings={[]} />
      </div>
    </>
  );
}

async function TransactionSection({ userId }: { userId: string }) {
  let transactions;
  try {
    transactions = await prisma.paymentTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return <ErrorState message="Failed to load subscription history." />;
  }

  return <SubscriptionHistory transactions={transactions} />;
}

// ── Page ────────────────────────────────────────────────────────────────────

function SectionLoader() {
  return (
    <div className="flex justify-center py-12">
      <Loader size={20} className="animate-spin text-muted-foreground" />
    </div>
  );
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/auth/signin");

  return (
    <div className="container px-page py-8 max-w-4xl">
      <BreadcrumbNav
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Profile" },
        ]}
        className="mb-4"
      />

      <Suspense fallback={<SectionLoader />}>
        <ProfileSections userId={session.user.id} />
      </Suspense>

      {session.user.role === "LEARNER" && (
        <Suspense fallback={<SectionLoader />}>
          <TransactionSection userId={session.user.id} />
        </Suspense>
      )}
    </div>
  );
}
