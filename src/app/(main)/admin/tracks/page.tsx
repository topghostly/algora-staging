import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ErrorState } from "@/components/ErrorState";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import TracksTable from "./TracksTable";

export const dynamic = "force-dynamic";

async function getTracks() {
  return await prisma.track.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { modules: true, enrollments: true },
      },
    },
  });
}

export default async function AdminTracksPage() {
  let tracks = null;
  try {
    tracks = await getTracks();
  } catch (error) {
    console.error("Error fetching tracks:", error);
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
