"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, ArrowRight } from "lucide-react";

interface EnrolledTrack {
  id: string;
  track: {
    id: string;
    title: string;
    description: string;
    _count: {
      modules: number;
    };
  };
  createdAt: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [enrollments, setEnrollments] = useState<EnrolledTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const res = await fetch("/api/user/enrollments");
        if (res.ok) {
          const data = await res.json();
          setEnrollments(data);
        }
      } catch (error) {
        console.error("Failed to fetch enrollments", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchEnrollments();
    }
  }, [session]);

  return (
    <div
      className="container"
      style={{ marginTop: "4rem", paddingBottom: "4rem" }}
    >
      <div style={{ marginBottom: "3rem" }}>
        <h1
          style={{
            marginBottom: "0.5rem",
            fontSize: "2.5rem",
            fontWeight: 700,
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>
          Welcome back,{" "}
          <span style={{ color: "var(--foreground)", fontWeight: 600 }}>
            {session?.user?.name}
          </span>
          !
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* Main Content - My Learning */}
        <div style={{ gridColumn: "1 / -1" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>My Learning</h2>
            <Link
              href="/tracks"
              className="btn btn-outline"
              style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}
            >
              Browse All Tracks
            </Link>
          </div>

          {loading ? (
            <div
              style={{
                padding: "3rem",
                textAlign: "center",
                color: "var(--muted)",
              }}
            >
              Loading your tracks...
            </div>
          ) : enrollments.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="card"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div style={{ marginBottom: "1rem" }}>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {enrollment.track.title}
                    </h3>
                    <p
                      style={{
                        color: "var(--muted)",
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {enrollment.track.description}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <BookOpen size={14} /> {enrollment.track._count.modules}{" "}
                      Modules
                    </span>
                    <Link
                      href={`/tracks/${enrollment.track.id}`}
                      style={{
                        color: "var(--primary)",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      Continue <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "4rem",
                textAlign: "center",
                backgroundColor: "var(--muted-light)",
                borderRadius: "var(--radius)",
                border: "1px dashed var(--border)",
              }}
            >
              <BookOpen
                size={48}
                color="var(--muted)"
                style={{ marginBottom: "1rem", opacity: 0.5 }}
              />
              <h3 style={{ marginBottom: "0.5rem", fontWeight: 600 }}>
                You haven't enrolled in any tracks yet.
              </h3>
              <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
                Start your journey by choosing a learning path.
              </p>
              <Link href="/tracks" className="btn btn-primary">
                Explore Tracks
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
