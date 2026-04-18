"use client";

import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { ErrorState } from "@/components/ErrorState";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import TutorTable from "./TutorTable";

interface TutorRow {
  id: string;
  name: string | null;
  email: string;
  specialties: string[];
  tutorStatus: string | null;
  calendarConnected: boolean;
  resumeLink: string | null;
  createdAt: Date;
  disabled: boolean;
}

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState<TutorRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/tutors")
      .then((res) => res.json())
      .then((data) => setTutors(data))
      .catch(() => setTutors(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-page min-h-[60vh] flex flex-col justify-center items-center gap-6">
        <p className="text-muted flex items-center gap-2">
          <Loader size={16} className="animate-spin" style={{ marginRight: "0.4rem" }} />
          Loading tutors…
        </p>
      </div>
    );
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
