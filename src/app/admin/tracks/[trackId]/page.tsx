import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import TrackEditor from "@/components/admin/TrackEditor";

export const dynamic = "force-dynamic";

interface AdminTrackPageProps {
  params: Promise<{
    trackId: string;
  }>;
}

async function getTrack(trackId: string) {
  return await prisma.track.findUnique({
    where: { id: trackId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });
}

export default async function AdminTrackPage({ params }: AdminTrackPageProps) {
  const { trackId } = await params;
  const track = await getTrack(trackId);

  if (!track) {
    notFound();
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/admin/tracks"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--muted)",
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}
        >
          <ChevronLeft size={16} /> Back to Tracks
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Edit Track</h1>
      </div>

      <TrackEditor track={track as any} />
    </div>
  );
}
