"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewTrackPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        published: false,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/tracks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin/tracks");
            }
        } catch (error) {
            console.error("Failed to create track", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Link
                href="/admin/tracks"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--muted)", marginBottom: "1.5rem" }}
            >
                <ArrowLeft size={16} />
                Back to Tracks
            </Link>

            <div className="card" style={{ maxWidth: "600px" }}>
                <h1 style={{ marginBottom: "1.5rem" }}>Create New Track</h1>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Title</label>
                        <input
                            type="text"
                            required
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                borderRadius: "var(--radius)",
                                border: "1px solid var(--border)",
                            }}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Description</label>
                        <textarea
                            required
                            rows={4}
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                borderRadius: "var(--radius)",
                                border: "1px solid var(--border)",
                                fontFamily: "inherit",
                            }}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <input
                            type="checkbox"
                            id="published"
                            checked={formData.published}
                            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                            style={{ width: "1.25rem", height: "1.25rem" }}
                        />
                        <label htmlFor="published" style={{ fontWeight: 500 }}>Publish immediately</label>
                    </div>

                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Creating..." : "Create Track"}
                        </button>
                        <Link href="/admin/tracks" className="btn btn-outline">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
