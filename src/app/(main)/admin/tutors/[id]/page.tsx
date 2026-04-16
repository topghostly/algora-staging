import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import TutorDetailClient from "./TutorDetailClient";

export const dynamic = "force-dynamic";

async function getTutor(id: string) {
  return await prisma.user.findUnique({
    where: { id, role: "TUTOR" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      specialties: true,
      tutorBio: true,
      tutorStatus: true,
      resumeLink: true,
      calendarConnected: true,
      hasCompletedOnboarding: true,
      disabled: true,
      suspended: true,
      createdAt: true,
    },
  });
}

export default async function AdminTutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const { id } = await params;
  const tutor = await getTutor(id);

  if (!tutor) notFound();

  return (
    <div className="p-6 px-page">
      <BreadcrumbNav
        items={[
          { label: "Admin Dashboard", href: "/admin" },
          { label: "Tutors", href: "/admin/tutors" },
          { label: tutor.name ?? tutor.email },
        ]}
        className="mb-6"
      />
      <TutorDetailClient tutor={tutor} />
    </div>
  );
}
