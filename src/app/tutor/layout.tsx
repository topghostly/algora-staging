import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ConnectCalendarButton from "@/components/ConnectCalendarButton";
import { prisma } from "@/lib/prisma";

export default async function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "TUTOR") {
    redirect("/");
  }

  // Fetch the latest calendar connection status from the DB
  // to ensure UI updates immediately after a redirection from route.tsx
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { calendarConnected: true },
  });

  const isCalendarConnected = user?.calendarConnected || false;

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        {/* <div className="border-b pb-4">
          <h1 className="text-3xl font-bold my-10">Tutor Portal</h1>
          <nav className="flex justify-between">
            <div className="flex gap-4 w-full justify-between">
              <div className="flex gap-4">
                <Link
                  href="/tutor"
                  className="hover:text-primary transition-colors"
                >
                  Overview
                </Link>
                <Link
                  href="/tutor/sessions"
                  className="hover:text-primary transition-colors"
                >
                  Sessions
                </Link>
              </div>
              <div className="mr-2">
                <Link href="/tutor/request" className="btn btn-outline">
                  1-on-1 Requests
                </Link>
              </div>
            </div>
            {!isCalendarConnected && (
              <ConnectCalendarButton email={session.user.email!} />
            )}
          </nav>
        </div> */}
        {children}
      </div>
    </div>
  );
}
