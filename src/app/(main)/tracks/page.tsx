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
import { ErrorState } from "@/components/ErrorState";

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
    {/* <div
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
    </div> */}
    <div
      style={{
        height: "1.5rem",
        width: "80%",
        backgroundColor: "var(--muted-light)",
        borderRadius: "4px",
        marginBottom: "1.4rem",
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
        marginBottom: "0.7rem",
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
    <main style={{ padding: "4rem 0" }}>
      <section
        style={{
          textAlign: "center",
        }}
        className="py-10md:py-22"
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ marginBottom: "1rem" }}>Learning Tracks</h1>
          <p
            style={{
              // fontSize: "1.2rem",
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
                size={16}
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
                className="w-full h-10 px-3 py-2 pl-10 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
      </section>

      <section className="md:mt-20">
        <div className="container">
          <div
            style={{
              marginBottom: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>
              {debouncedQuery
                ? `Search results for "${debouncedQuery}"`
                : "All Tracks"}
            </h3>

            {!debouncedQuery && (
              <div className="hidden md:block">
                <Link
                  href="/tracks"
                  className="btn btn-outline px-3 py-2 text-sm rounded-full
                  "
                >
                  Explore All Tracks
                </Link>
              </div>
            )}
          </div>

          {error ? (
            <div className="my-10">
              <ErrorState message={error} onReload={handleReload} />
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))",
                gap: "1rem",
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
                          justifyContent: "space-between",
                          height: "100%",
                          gap: "20px",
                        }}
                      >
                        {/* <div
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
                      </div> */}

                        <div className="h-16">
                          <h3
                            style={{
                              fontWeight: 500,
                              marginBottom: "0.75rem",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {track.title}
                          </h3>
                        </div>
                        <div
                          style={{
                            height: "3rem",
                          }}
                        >
                          <p
                            style={{
                              color: "var(--muted)",

                              lineHeight: 1.6,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {track.description}
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1.5rem",
                            // marginBottom: "1rem",
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
          )}
        </div>
      </section>
      <div className="block md:hidden mt-15">
        <div className="flex justify-center">
          <Link href="/tracks" className="btn btn-outline px-3 py-2 text-sm">
            Explore All Tracks
          </Link>
        </div>
      </div>
    </main>
  );
}
