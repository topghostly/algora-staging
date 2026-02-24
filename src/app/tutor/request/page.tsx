import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateRequestStatus } from "@/app/actions/request";
import Link from "next/link";
import { Calendar, Clock, User, Check, X, Info } from "lucide-react";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";

async function getRequests(tutorId: string) {
  return await prisma.sessionRequest.findMany({
    where: {
      tutorId,
      status: "PENDING",
    },
    include: {
      student: {
        select: { name: true, email: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function TutorRequestsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "TUTOR") {
    redirect("/auth/signin");
  }

  const requests = await getRequests(session.user.id);

  return (
    <div className="container py-10">
      <BreadcrumbNav
        items={[
          { label: "Tutor Dashboard", href: "/tutor" },
          { label: "Session Requests" },
        ]}
        className="mb-6"
      />
      <div className="flex justify-between items-center mb-8">
        <h1
          style={{
            marginBottom: "0.5rem",
            fontSize: "2rem",
            fontWeight: 500,
          }}
        >
          Session Requests
        </h1>
        <p className="text-muted-foreground p-2 rounded-md">
          {requests.length} pending requests
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="h-[60vh] text-center py-12 flex flex-col items-center justify-center">
          <Info className="mx-auto h-12 w-12 text-muted-foreground mb-8" />
          <p className="text-muted-foreground">
            No pending requests at the moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((request: any) => (
            <div
              key={request.id}
              className="bg-card border rounded-xl p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {request.student.name?.[0] ||
                        request.student.email[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{request.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Requested by:{" "}
                        {request.student.name || request.student.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      <span>{request.preferredDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} />
                      <span>{request.preferredTime}</span>
                    </div>
                  </div>

                  {request.message && (
                    <div className="bg-muted/30 p-4 rounded-lg text-sm border italic">
                      "{request.message}"
                    </div>
                  )}
                </div>

                <div className="flex gap-3 shrink-0">
                  <form
                    action={updateRequestStatus.bind(
                      null,
                      request.id,
                      "REJECTED",
                    )}
                  >
                    <button
                      type="submit"
                      className="btn btn-outline border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground px-4"
                    >
                      <X size={18} className="mr-2" />
                      Decline
                    </button>
                  </form>
                  <Link
                    href={`/tutor/sessions/new?studentEmail=${encodeURIComponent(request.student.email)}&title=${encodeURIComponent(request.title)}&requestId=${request.id}&preferredDate=${request.preferredDate}&preferredTime=${request.preferredTime}`}
                    className="btn btn-primary px-4"
                  >
                    <Check size={18} className="mr-2" />
                    Accept & Create Session
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
