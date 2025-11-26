"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, GripVertical, FileText, Video, HelpCircle } from "lucide-react";

interface Lesson {
    id: string;
    title: string;
    type: "VIDEO" | "TEXT" | "QUIZ";
    order: number;
}

interface Module {
    id: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

interface Track {
    id: string;
    title: string;
    description: string;
    published: boolean;
    modules: Module[];
}

export default function EditTrackPage({ params }: { params: { trackId: string } }) {
    const router = useRouter();
    const [track, setTrack] = useState<Track | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Modal states
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

    const [newItemTitle, setNewItemTitle] = useState("");
    const [newLessonType, setNewLessonType] = useState<"VIDEO" | "TEXT" | "QUIZ">("VIDEO");

    useEffect(() => {
        fetchTrack();
    }, [params.trackId]);

    const fetchTrack = async () => {
        try {
            const res = await fetch(`/api/tracks/${params.trackId}`);
            if (res.ok) {
                const data = await res.json();
                setTrack(data);
            } else {
                router.push("/admin/tracks");
            }
        } catch (error) {
            console.error("Failed to fetch track", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!track) return;
        setSaving(true);

        try {
            await fetch(`/api/tracks/${track.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: track.title,
                    description: track.description,
                    published: track.published,
                }),
            });
            alert("Track updated successfully");
        } catch (error) {
            console.error("Failed to update track", error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddModule = async () => {
        if (!track || !newItemTitle) return;

        try {
            const res = await fetch("/api/modules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newItemTitle,
                    trackId: track.id,
                    order: track.modules.length,
                }),
            });

            if (res.ok) {
                setNewItemTitle("");
                setShowModuleModal(false);
                fetchTrack();
            }
        } catch (error) {
            console.error("Failed to add module", error);
        }
    };

    const handleAddLesson = async () => {
        if (!track || !activeModuleId || !newItemTitle) return;

        try {
            const res = await fetch("/api/lessons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newItemTitle,
                    moduleId: activeModuleId,
                    type: newLessonType,
                    order: 999, // Backend should handle order or we can calculate it
                }),
            });

            if (res.ok) {
                setNewItemTitle("");
                setShowLessonModal(false);
                fetchTrack();
            }
        } catch (error) {
            console.error("Failed to add lesson", error);
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (!confirm("Delete this module and all its lessons?")) return;
        try {
            await fetch(`/api/modules/${moduleId}`, { method: "DELETE" });
            fetchTrack();
        } catch (error) {
            console.error("Failed to delete module", error);
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!confirm("Delete this lesson?")) return;
        try {
            await fetch(`/api/lessons/${lessonId}`, { method: "DELETE" });
            fetchTrack();
        } catch (error) {
            console.error("Failed to delete lesson", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!track) return <div>Track not found</div>;

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <Link
                    href="/admin/tracks"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--muted)" }}
                >
                    <ArrowLeft size={16} />
                    Back to Tracks
                </Link>
                <button onClick={handleUpdateTrack} className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "2rem" }}>
                {/* Left Column: Curriculum */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h2>Curriculum</h2>
                        <button
                            className="btn btn-outline"
                            onClick={() => { setShowModuleModal(true); setNewItemTitle(""); }}
                        >
                            <Plus size={16} style={{ marginRight: "0.5rem" }} />
                            Add Module
                        </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {track.modules.map((module) => (
                            <div key={module.id} className="card" style={{ padding: "0" }}>
                                <div style={{
                                    padding: "1rem",
                                    borderBottom: "1px solid var(--border)",
                                    backgroundColor: "var(--muted-light)",
                                    borderTopLeftRadius: "var(--radius-lg)",
                                    borderTopRightRadius: "var(--radius-lg)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
                                        <GripVertical size={16} color="var(--muted)" style={{ cursor: "move" }} />
                                        {module.title}
                                    </div>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <button
                                            className="btn btn-outline"
                                            style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                                            onClick={() => {
                                                setActiveModuleId(module.id);
                                                setShowLessonModal(true);
                                                setNewItemTitle("");
                                            }}
                                        >
                                            <Plus size={14} style={{ marginRight: "0.25rem" }} />
                                            Add Lesson
                                        </button>
                                        <button
                                            className="btn btn-outline"
                                            style={{ padding: "0.25rem", color: "var(--error)", borderColor: "transparent" }}
                                            onClick={() => handleDeleteModule(module.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div style={{ padding: "0.5rem" }}>
                                    {module.lessons.length === 0 && (
                                        <div style={{ padding: "1rem", textAlign: "center", color: "var(--muted)", fontSize: "0.9rem" }}>
                                            No lessons yet.
                                        </div>
                                    )}
                                    {module.lessons.map((lesson) => (
                                        <div
                                            key={lesson.id}
                                            style={{
                                                padding: "0.75rem",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                borderBottom: "1px solid var(--border)",
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <GripVertical size={14} color="var(--muted)" />
                                                {lesson.type === "VIDEO" && <Video size={16} color="var(--primary)" />}
                                                {lesson.type === "TEXT" && <FileText size={16} color="var(--secondary)" />}
                                                {lesson.type === "QUIZ" && <HelpCircle size={16} color="var(--accent)" />}
                                                <span style={{ fontSize: "0.95rem" }}>{lesson.title}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteLesson(lesson.id)}
                                                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Track Settings */}
                <div>
                    <div className="card" style={{ position: "sticky", top: "2rem" }}>
                        <h3 style={{ marginBottom: "1rem" }}>Track Settings</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: 500 }}>Title</label>
                                <input
                                    type="text"
                                    style={{ width: "100%", padding: "0.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}
                                    value={track.title}
                                    onChange={(e) => setTrack({ ...track, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: 500 }}>Description</label>
                                <textarea
                                    rows={4}
                                    style={{ width: "100%", padding: "0.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)", fontFamily: "inherit" }}
                                    value={track.description}
                                    onChange={(e) => setTrack({ ...track, description: e.target.value })}
                                />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <input
                                    type="checkbox"
                                    id="published-edit"
                                    checked={track.published}
                                    onChange={(e) => setTrack({ ...track, published: e.target.checked })}
                                />
                                <label htmlFor="published-edit" style={{ fontSize: "0.9rem" }}>Published</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Module Modal */}
            {showModuleModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
                }}>
                    <div className="card" style={{ width: "400px" }}>
                        <h3>Add New Module</h3>
                        <input
                            type="text"
                            placeholder="Module Title"
                            autoFocus
                            style={{ width: "100%", padding: "0.75rem", margin: "1rem 0", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}
                            value={newItemTitle}
                            onChange={(e) => setNewItemTitle(e.target.value)}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                            <button className="btn btn-outline" onClick={() => setShowModuleModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleAddModule}>Add Module</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lesson Modal */}
            {showLessonModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
                }}>
                    <div className="card" style={{ width: "400px" }}>
                        <h3>Add New Lesson</h3>
                        <div style={{ margin: "1rem 0", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <input
                                type="text"
                                placeholder="Lesson Title"
                                autoFocus
                                style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}
                                value={newItemTitle}
                                onChange={(e) => setNewItemTitle(e.target.value)}
                            />
                            <select
                                style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}
                                value={newLessonType}
                                onChange={(e) => setNewLessonType(e.target.value as any)}
                            >
                                <option value="VIDEO">Video Lesson</option>
                                <option value="TEXT">Text / Article</option>
                                <option value="QUIZ">Quiz</option>
                            </select>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                            <button className="btn btn-outline" onClick={() => setShowLessonModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleAddLesson}>Add Lesson</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
