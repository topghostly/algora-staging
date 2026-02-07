import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ConnectCalendarButton from "@/components/ConnectCalendarButton";
import { decrypt } from "@/lib/crypto";

export default async function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "TUTOR") {
    redirect("/");
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="border-b pb-4">
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
              <div>
                <Link href="/tutor/request" className="btn btn-outline">
                  1-on-1 Requests
                </Link>
              </div>
            </div>
            {!session.user.calendarConnected && (
              <ConnectCalendarButton email={session.user.email!} />
            )}
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}
