import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ErrorState } from "@/components/ErrorState";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import TutorTable from "./TutorTable";

export const dynamic = "force-dynamic";

async function getTutors() {
  return await prisma.user.findMany({
    where: { role: "TUTOR" },
    orderBy: [
      // PENDING first, then APPROVED, then REJECTED
      { tutorStatus: "asc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      name: true,
      email: true,
      specialties: true,
      tutorStatus: true,
      calendarConnected: true,
      resumeLink: true,
      createdAt: true,
      disabled: true,
    },
  });
}

export default async function AdminTutorsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  let tutors = null;
  try {
    tutors = await getTutors();
  } catch (error) {
    console.error("Error fetching tutors:", error);
  }

  return (
    <div className="p-6 px-page">
      <BreadcrumbNav
        items={[
          { label: "Admin Dashboard", href: "/admin" },
          { label: "Tutors" },
        ]}
        className="mb-6"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 500 }}>Tutors</h1>
        {tutors && (
          <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
            {tutors.filter((t) => t.tutorStatus === "PENDING").length} pending
            review
          </span>
        )}
      </div>

      {!tutors ? (
        <div className="p-12">
          <ErrorState message="We couldn't load tutors at this time. Please try again." />
        </div>
      ) : (
        <TutorTable tutors={tutors} />
      )}
    </div>
  );
}
