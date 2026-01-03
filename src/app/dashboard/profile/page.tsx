import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SubscriptionCard from "@/components/profile/SubscriptionCard";
import BookingHistory from "@/components/profile/BookingHistory";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      bookings: {
        include: {
          session: {
            include: {
              tutor: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: {
          session: {
            startTime: "desc",
          },
        },
        take: 5,
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container py-8 max-w-4xl">
      <ProfileHeader user={user} />

      <div className="grid gap-6 md:grid-cols-2">
        <SubscriptionCard
          subscriptionTier={user.subscriptionTier}
          credits1on1={user.credits1on1}
        />
        <BookingHistory bookings={user.bookings} />
      </div>
    </div>
  );
}
