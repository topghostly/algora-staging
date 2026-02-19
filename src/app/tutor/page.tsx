"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Users, Clock } from "lucide-react";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";

export default function TutorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.role === "TUTOR" &&
      !session?.user?.hasCompletedOnboarding
    ) {
      router.push("/tutor/onboarding");
    }
  }, [session, status, router]);

  const frameworks = [
    { value: "react", label: "React" },
    { value: "next", label: "Next.js" },
    { value: "vue", label: "Vue" },
  ];
  const [value, setValue] = useState("");
  return (
    <div className="space-y-6">
      <BreadcrumbNav items={[{ label: "Tutor Dashboard" }]} className="mb-4" />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Upcoming Sessions</h3>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Next session in --</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
              <Users size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Total Students</h3>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Lifetime unique students
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-500/10 rounded-full text-green-500">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Hours Taught</h3>
              <p className="text-2xl font-bold">0h</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Total session time</p>
        </div>

        <div className="col-span-full mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Quick Actions</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/tutor/sessions"
              className="card p-6 hover:border-primary transition-colors group"
            >
              <h3 className="font-semibold mb-2 group-hover:text-primary">
                Manage Sessions
              </h3>
              <p className="text-sm text-muted-foreground">
                Create, edit, or cancel your availability slots.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
