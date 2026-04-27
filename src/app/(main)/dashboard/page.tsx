"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/ErrorState";
import GlobalLoader from "@/components/GlobalLoader";
import { Button } from "@/components/ui/button";
import { LottieAnimation } from "@/components/NotFoundAnimation";

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
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/auth/signin");
    },
  });
  const [enrollments, setEnrollments] = useState<EnrolledTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const res = await fetch("/api/user/enrollments");
        if (res.ok) {
          const data = await res.json();
          setEnrollments(data);
          setError(null);
        } else {
          setError("Failed to load your learning tracks. Please try again.");
        }
      } catch (error) {
        console.error("Failed to fetch enrollments", error);
        setError(
          "A network error occurred. Please check your connection and try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchEnrollments();
    }
  }, [session]);

  useEffect(() => {
    if (session && session.user?.role !== "LEARNER") {
      router.replace("/auth/redirect");
    }
  }, [session, router]);

  if (status === "loading") {
    return <GlobalLoader />;
  }

  if (!session || session.user?.role !== "LEARNER") {
    return null;
  }

  return (
    <div className="container px-page">
      <div className="my-16">
        <p
          style={{
            marginBottom: "3rem",
          }}
        >
          Dashboard
        </p>
        <h1 className="font-light">
          Welcome, <br />{" "}
          <span className="font-medium">{session?.user?.name}</span>
        </h1>
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
            <h3>My Learning</h3>
            <Link
              href="/tracks"
              className="btn btn-outline rounded-full"
              // style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}
            >
              Browse All Tracks
            </Link>
          </div>

          {error ? (
            <div className="my-8">
              <ErrorState message={error} />
            </div>
          ) : loading ? (
            <div className="p-18 text-muted flex justify-center items-center flex-row gap-2">
              <Loader size={18} className="animate-spin" />
              Loading your tracks...
            </div>
          ) : enrollments.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="card relative"
                  style={{
                    display: "flex",
                    boxShadow: "none",
                    flexDirection: "column",
                  }}
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      fill="var(--primary)"
                      version="1.1"
                      id="Capa_1"
                      // width="45px"
                      // height="45px"
                      viewBox="0 0 26.514 26.515"
                      xmlSpace="preserve"
                      className="w-[30px] md:w-[45px] absolute top-0 right-[5px]"
                    >
                      <g>
                        <path d="M23.649,1.501l-0.002,23.514c0,0.56-0.312,1.072-0.809,1.331c-0.494,0.257-1.095,0.219-1.554-0.104l-8.028-5.618   l-8.031,5.618c-0.257,0.182-0.56,0.271-0.86,0.271c-0.236,0-0.475-0.056-0.692-0.169c-0.495-0.259-0.808-0.771-0.808-1.331   L2.868,1.5c0-0.829,0.672-1.5,1.5-1.5h2.451v13.258c0,0.828,0.672,1.5,1.5,1.5s1.5-0.672,1.5-1.5V0.001h12.33   c0.396,0,0.779,0.158,1.061,0.439C23.492,0.721,23.649,1.103,23.649,1.501z" />
                      </g>
                    </svg>
                  </span>
                  <div style={{ marginBottom: "1rem" }}>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 500,
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
                    <Link href={`/tracks/${enrollment.track.id}`}>
                      <Button variant={"outline"}>Continue</Button>
                    </Link>
                  </div>
                </div>
              ))}
              e
            </div>
          ) : (
            <div className="h-[50vh] w-full flex items-center justify-center">
              <div className="text-center">
                <div className="flex mx-auto h-60 w-60 md:h-72 md:w-72 items-center justify-center overflow-hidden mb-6 scale-150">
                  <LottieAnimation
                    jsonPath="/json/fixed_loop_color_changed.json"
                    fallbackWebm="/videos/empty.webm"
                  />
                </div>
                <h3 className="text-2xl font-medium mb-2 -mt-6">
                  You haven't enrolled in any tracks yet.
                </h3>
                <p className="text-muted-foreground mb-3">
                  Start your journey by choosing a learning path.
                </p>
                <Link href="/tracks" className="btn btn-primary rounded-full">
                  Explore Tracks
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
