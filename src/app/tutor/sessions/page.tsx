import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import SessionDelete from "@/components/sessionDelete";

async function getSessions(userId: string) {
  return await prisma.tutorSession.findMany({
    where: {
      tutorId: userId,
    },
    orderBy: {
      startTime: "asc",
    },
    include: {
      bookings: {
        include: {
          user: true,
        },
      },
    },
  });
}

export default async function TutorSessionsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const sessions = await getSessions(session.user.id);
  console.log(sessions);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Your Sessions</h2>
        <Link
          href="/tutor/sessions/new"
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Create Session
        </Link>
      </div>

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/50">
            <p className="text-muted-foreground">No sessions created yet.</p>
            <Link
              href="/tutor/sessions/new"
              className="text-primary hover:underline mt-2 inline-block"
            >
              Create your first session
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="card p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(s.startTime).toLocaleString()} -{" "}
                    {new Date(s.endTime).toLocaleTimeString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      s.type === "ONE_ON_ONE"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {s.type.replace("_", " ")}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {s.bookings.length} / {s.type === "ONE_ON_ONE" ? 1 : "∞"}{" "}
                    Booked
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button className="btn btn-outline btn-sm">Edit</button>
                    <SessionDelete id={s.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
