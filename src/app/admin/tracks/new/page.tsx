"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Loader2 } from "lucide-react";

export default function NewTrackPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    try {
      const res = await fetch("/api/tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        throw new Error("Failed to create track");
      }

      const track = await res.json();
      router.push(`/admin/tracks/${track.id}`); // Redirect to edit page to add modules
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
        <h1 style={{ fontSize: "2rem", fontWeight: 500 }}>Create New Track</h1>
      </div>

      <div className="card" style={{ padding: "2rem" }}>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {error && (
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#fee2e2",
                color: "#ef4444",
                borderRadius: "var(--radius)",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="title"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 500,
              }}
            >
              Track Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="e.g. Frontend Development Mastery"
              className="input"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 500,
              }}
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              placeholder="A brief overview of what students will learn..."
              className="input"
              style={{
                width: "100%",
                minHeight: "120px",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <Link href="/admin/tracks" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{
                minWidth: "120px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Save size={18} style={{ marginRight: "0.5rem" }} />
                  Create Track
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
