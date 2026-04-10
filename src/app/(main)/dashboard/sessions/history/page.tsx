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
  const [enrollments, requests] = await Promise.all([
    prisma.sessionEnrollment.findMany({
      where: { userId },
      include: {
        session: {
          include: { tutor: true },
        },
      },
      orderBy: { enrolledAt: "desc" },
    }),
    prisma.sessionRequest.findMany({
      where: { studentId: userId },
      include: { tutor: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const enrollmentRows: HistoryRow[] = enrollments.map((e) => ({
    id: e.id,
    kind: "Group Session",
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

  const requestRows: HistoryRow[] = requests.map((r) => ({
    id: r.id,
    kind: "1-on-1 Request",
    title: r.title,
    tutor: r.tutor.name || r.tutor.email || "Algora Tutor",
    displayDate: `${r.preferredDate} · ${r.preferredTime}`,
    sortDate: r.createdAt,
    status: r.status,
  }));

  return [...enrollmentRows, ...requestRows].sort(
    (a, b) => b.sortDate.getTime() - a.sortDate.getTime(),
  );
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
        border: "1px solid var(--border)",
        borderRadius: "0.5rem",
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
        className="mt-8 -mb-12"
      />
      <div className="my-16">
        <h1 className="text-[2rem] font-medium mb-1">Session History</h1>
        <p className="text-muted-foreground text-sm mb-10">
          All your group sessions, 1-on-1 requests, and their outcomes.
        </p>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-24">
              <Loader
                size={28}
                className="animate-spin text-muted-foreground"
              />
            </div>
          }
        >
          <HistorySection userId={userId} />
        </Suspense>
      </div>
    </div>
  );
}
