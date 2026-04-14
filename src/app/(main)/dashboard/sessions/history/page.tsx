import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Loader } from "lucide-react";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { ErrorState } from "@/components/ErrorState";
import { Suspense } from "react";
import HistoryTable, { type HistoryRow } from "./HistoryTable";

async function getSessionHistory(userId: string): Promise<HistoryRow[]> {
  const enrollments = await prisma.sessionEnrollment.findMany({
    where: { userId },
    include: {
      session: { include: { tutor: true } },
    },
    orderBy: { enrolledAt: "desc" },
  });

  return enrollments.map((e) => ({
    id: e.id,
    kind: e.session.type === "ONE_ON_ONE" ? "1-on-1 Session" : "Group Session",
    title: e.session.title,
    tutor: e.session.tutor.name || e.session.tutor.email || "Algora Tutor",
    displayDate: new Date(e.session.startTime).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    sortDate: e.session.startTime,
    status: e.session.status,
  }));
}

async function HistorySection({ userId }: { userId: string }) {
  let rows: HistoryRow[] = [];
  try {
    rows = await getSessionHistory(userId);
  } catch {
    return (
      <div className="my-10">
        <ErrorState message="We couldn't load your session history at this time. Please try again." />
      </div>
    );
  }

  return (
    <div
      style={{
        overflow: "hidden",
      }}
    >
      <HistoryTable rows={rows} />
    </div>
  );
}

export default async function SessionHistoryPage() {
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
          { label: "Sessions", href: "/dashboard/sessions" },
          { label: "History" },
        ]}
        className="my-16"
      />
      <div className="my-16">
        <h1 className="text-[2rem] font-medium mb-3">Session History</h1>
        <p className="text-muted-foreground text-sm mb-10">
          All your group sessions, 1-on-1 requests, and their outcomes.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <Loader size={28} className="animate-spin text-muted-foreground" />
          </div>
        }
      >
        <HistorySection userId={userId} />
      </Suspense>
    </div>
  );
}
