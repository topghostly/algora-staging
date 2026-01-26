"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Search,
  X,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import EnrollButton from "@/components/EnrollButton";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Track {
  id: string;
  title: string;
  description: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    modules: number;
  };
}

const SkeletonTrackCard = () => (
  <div
    className="card"
    style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      padding: "1.5rem",
      backgroundColor: "var(--background)",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <div
      style={{
        height: "200px",
        backgroundColor: "var(--muted-light)",
        borderRadius: "var(--radius)",
        marginBottom: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
      />
    </div>
    <div
      style={{
        height: "1.5rem",
        width: "80%",
        backgroundColor: "var(--muted-light)",
        borderRadius: "4px",
        marginBottom: "1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
      />
    </div>
    <div
      style={{
        height: "1rem",
        width: "100%",
        backgroundColor: "var(--muted-light)",
        borderRadius: "4px",
        marginBottom: "0.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
      />
    </div>
    <div
      style={{
        height: "1rem",
        width: "90%",
        backgroundColor: "var(--muted-light)",
        borderRadius: "4px",
        marginBottom: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
      />
    </div>
    <div
      style={{
        marginTop: "auto",
        height: "3rem",
        width: "100%",
        backgroundColor: "var(--muted-light)",
        borderRadius: "var(--radius)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
      />
    </div>
  </div>
);

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const fetchTracks = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = search
        ? `/api/tracks?search=${encodeURIComponent(search)}`
        : "/api/tracks";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch tracks");
      const data = await res.json();
      setTracks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  // Handle debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch when debounced query changes
  useEffect(() => {
    fetchTracks(debouncedQuery);
  }, [debouncedQuery, fetchTracks]);

  const handleReload = () => {
    fetchTracks(debouncedQuery);
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <main style={{ paddingBottom: "4rem" }}>
      <section
        style={{
          padding: "6rem 0",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            backgroundColor: "rgba(0, 137, 123, 0.1)",
            color: "var(--primary)",
            borderRadius: "99px",
            fontWeight: 600,
            fontSize: "0.9rem",
            marginBottom: "1.5rem",
          }}
        >
          Launching the next generation of African Tech Talent
        </div>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{ fontSize: "3rem", fontWeight: 700, marginBottom: "1rem" }}
          >
            Learning Tracks
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--muted)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Choose a path and start your journey to becoming a world-class
            developer.
          </p>
        </div>

        {/* Search Bar - Integrated from TrackSearch */}
        <div className="container">
          <div
            style={{
              maxWidth: "700px",
              margin: "2rem auto 4rem",
              position: "relative",
            }}
          >
            <div style={{ position: "relative" }}>
              <Search
                size={20}
                color="var(--muted)"
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search for tracks"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "1rem 2.5rem",
                  borderRadius: "var(--radius-lg)",
                  border: "2px solid var(--border)",
                  fontSize: "1rem",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
              {query && (
                <button
                  onClick={clearSearch}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px",
                    borderRadius: "50%",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--muted-light)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="container">
          <Image
            src="/images/man_holding_binoculars_with_plants.svg"
            alt="man_holding_binoculars_with_plants"
            width={0}
            height={0}
            style={{
              width: "100%",
              height: "auto",
              pointerEvents: "none",
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
            }}
            sizes="100vw"
          />
        </div>
      </section>

      <section>
        <div className="container">
          <div
            style={{
              marginBottom: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontSize: "2rem", fontWeight: 700 }}>
              {debouncedQuery
                ? `Search results for "${debouncedQuery}"`
                : "Recommended Tracks"}
            </h3>

            {!debouncedQuery && (
              <Link
                href="/tracks"
                className="btn btn-outline"
                style={{
                  padding: "0.75rem 2rem",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                Explore All Tracks
              </Link>
            )}
          </div>

          {error && (
            <div
              style={{
                textAlign: "center",
                padding: "4rem",
                backgroundColor: "rgba(239, 68, 68, 0.05)",
                borderRadius: "var(--radius)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
              }}
            >
              <AlertCircle size={48} style={{ marginBottom: "1rem" }} />
              <h3 style={{ marginBottom: "0.5rem" }}>Failed to Load Tracks</h3>
              <p style={{ marginBottom: "1.5rem" }}>{error}</p>
              <button
                onClick={handleReload}
                className="btn btn-primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  margin: "0 auto",
                }}
              >
                <RefreshCw size={18} /> Reload Page
              </button>
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "2rem",
            }}
          >
            <AnimatePresence mode="popLayout">
              {loading
                ? // Skeleton loading state
                  Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <SkeletonTrackCard />
                    </motion.div>
                  ))
                : tracks.map((track) => (
                    <motion.div
                      key={track.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="card"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          height: "200px",
                          borderRadius: "var(--radius) var(--radius) 0 0",
                          margin: "-1.5rem -1.5rem 1.5rem -1.5rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "var(--muted-light)",
                        }}
                      >
                        <BookOpen
                          size={64}
                          color="var(--primary)"
                          opacity={0.5}
                        />
                      </div>

                      <h2
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          marginBottom: "0.75rem",
                          height: "4.4  rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {track.title}
                      </h2>
                      <p
                        style={{
                          color: "var(--muted)",
                          marginBottom: "1.5rem",
                          lineHeight: 1.6,
                          height: "6.4rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {track.description}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1.5rem",
                          marginBottom: "1.5rem",
                          fontSize: "0.9rem",
                          color: "var(--muted)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <BookOpen size={16} />
                          <span>{track._count.modules} Modules</span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <Clock size={16} />
                          <span>Self-paced</span>
                        </div>
                      </div>

                      <EnrollButton trackId={track.id} />
                    </motion.div>
                  ))}
            </AnimatePresence>

            {!loading && !error && tracks.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "4rem",
                  backgroundColor: "var(--muted-light)",
                  borderRadius: "var(--radius)",
                  border: "1px dashed var(--border)",
                }}
              >
                <h3 style={{ marginBottom: "1rem" }}>
                  {debouncedQuery
                    ? `No tracks found matching "${debouncedQuery}"`
                    : "No tracks available yet"}
                </h3>
                <p style={{ color: "var(--muted)" }}>
                  {debouncedQuery
                    ? "Try searching for something else or browse all tracks."
                    : "Check back soon! We are working hard to create amazing content for you."}
                </p>
                {debouncedQuery && (
                  <button
                    onClick={clearSearch}
                    className="btn btn-primary"
                    style={{ marginTop: "1.5rem" }}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
