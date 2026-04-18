"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Loader } from "lucide-react";
import { ErrorState } from "@/components/ErrorState";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import TracksTable, { type TrackRow } from "./TracksTable";

export default function AdminTracksPage() {
  const [tracks, setTracks] = useState<TrackRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/tracks")
      .then((res) => res.json())
      .then((data) => setTracks(data))
      .catch(() => setTracks(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-page min-h-[60vh] flex flex-col justify-center items-center gap-6">
        <p className="text-muted flex items-center gap-2">
          <Loader size={16} className="animate-spin" style={{ marginRight: "0.4rem" }} />
          Loading tracks…
        </p>
      </div>
    );
  }

  return (
    <div className="px-page">
      <BreadcrumbNav
        items={[
          { label: "Admin Dashboard", href: "/admin" },
          { label: "Tracks" },
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
        <h1 style={{ fontSize: "2rem", fontWeight: 500 }}>Tracks</h1>
        <Link
          href="/admin/tracks/new"
          className="btn btn-primary rounded-full"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Plus size={18} />
          New Track
        </Link>
      </div>

      {!tracks ? (
        <div className="card p-12">
          <ErrorState message="We couldn't load the tracks at this time. Please try again." />
        </div>
      ) : (
        <TracksTable tracks={tracks} />
      )}
    </div>
  );
}
