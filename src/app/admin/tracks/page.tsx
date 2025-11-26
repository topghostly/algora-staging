"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Track {
    id: string;
    title: string;
    description: string;
    published: boolean;
    _count: {
        modules: number;
    };
}

export default function TracksPage() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTracks();
    }, []);

    const fetchTracks = async () => {
        try {
            const res = await fetch("/api/tracks");
            const data = await res.json();
            setTracks(data);
        } catch (error) {
            console.error("Failed to fetch tracks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this track?")) return;

        try {
            const res = await fetch(`/api/tracks/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchTracks();
            }
        } catch (error) {
            console.error("Failed to delete track", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1>Tracks</h1>
                <Link href="/admin/tracks/new" className="btn btn-primary">
                    <Plus size={18} style={{ marginRight: "0.5rem" }} />
                    New Track
                </Link>
            </div>

            <div className="card">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                            <th style={{ padding: "1rem" }}>Title</th>
                            <th style={{ padding: "1rem" }}>Modules</th>
                            <th style={{ padding: "1rem" }}>Status</th>
                            <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tracks.map((track) => (
                            <tr key={track.id} style={{ borderBottom: "1px solid var(--border)" }}>
                                <td style={{ padding: "1rem" }}>
                                    <div style={{ fontWeight: 500 }}>{track.title}</div>
                                    <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{track.description}</div>
                                </td>
                                <td style={{ padding: "1rem" }}>{track._count?.modules || 0}</td>
                                <td style={{ padding: "1rem" }}>
                                    <span
                                        style={{
                                            padding: "0.25rem 0.5rem",
                                            borderRadius: "99px",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            backgroundColor: track.published ? "var(--primary-light)" : "var(--muted-light)",
                                            color: track.published ? "var(--primary)" : "var(--muted)",
                                        }}
                                    >
                                        {track.published ? "Published" : "Draft"}
                                    </span>
                                </td>
                                <td style={{ padding: "1rem", textAlign: "right" }}>
                                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                                        <Link href={`/admin/tracks/${track.id}`} className="btn btn-outline" style={{ padding: "0.4rem" }}>
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(track.id)}
                                            className="btn btn-outline"
                                            style={{ padding: "0.4rem", color: "var(--error)", borderColor: "var(--error)" }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {tracks.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}>
                                    No tracks found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
