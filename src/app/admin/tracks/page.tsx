import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Eye, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ErrorState } from "@/components/ErrorState";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";

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
    <div>
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
          className="btn btn-primary"
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
        <div
          className="card overflow-x-auto"
          style={{ padding: 0, border: "none" }}
        >
          <table style={{ minWidth: "800px", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border)",
                  backgroundColor: "var(--muted-light)",
                  textAlign: "left",
                }}
              >
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  Title
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  Modules
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  Students
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  Created
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    textAlign: "right",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tracks.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "var(--muted)",
                    }}
                  >
                    No tracks found. Create your first one!
                  </td>
                </tr>
              ) : (
                tracks.map((track) => (
                  <tr
                    key={track.id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td style={{ padding: "1rem", fontWeight: 500 }}>
                      {track.title}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "999px",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          backgroundColor: track.published
                            ? "#dcfce7"
                            : "#f3f4f6",
                          color: track.published ? "#16a34a" : "#6b7280",
                        }}
                      >
                        {track.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>{track._count.modules}</td>
                    <td style={{ padding: "1rem" }}>
                      {track._count.enrollments}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        fontSize: "0.9rem",
                        color: "var(--muted)",
                      }}
                    >
                      {new Date(track.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "0.5rem",
                        }}
                      >
                        <Link
                          href={`/tracks/${track.id}`}
                          target="_blank"
                          className="btn btn-outline"
                          style={{ padding: "0.4rem", height: "auto" }}
                          title="View Public Page"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/admin/tracks/${track.id}`}
                          className="btn btn-outline"
                          style={{ padding: "0.4rem", height: "auto" }}
                          title="Edit Content"
                        >
                          <Edit size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
