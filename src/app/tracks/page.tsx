import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import EnrollButton from "@/components/EnrollButton";

export const dynamic = "force-dynamic";

async function getTracks() {
    const tracks = await prisma.track.findMany({
        where: { published: true },
        include: {
            _count: {
                select: { modules: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return tracks;
}

export default async function TracksPage() {
    const tracks = await getTracks();

    return (
        <main className="container" style={{ padding: "4rem 0" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                <h1 style={{ fontSize: "3rem", fontWeight: 700, marginBottom: "1rem" }}>Learning Tracks</h1>
                <p style={{ fontSize: "1.2rem", color: "var(--muted)", maxWidth: "600px", margin: "0 auto" }}>
                    Choose a path and start your journey to becoming a world-class developer.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "2rem" }}>
                {tracks.map((track) => (
                    <div key={track.id} className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                        <div style={{
                            height: "200px",
                            backgroundColor: "var(--primary-light)",
                            borderRadius: "var(--radius) var(--radius) 0 0",
                            margin: "-1.5rem -1.5rem 1.5rem -1.5rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <BookOpen size={64} color="var(--primary)" opacity={0.5} />
                        </div>

                        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>{track.title}</h2>
                        <p style={{ color: "var(--muted)", marginBottom: "1.5rem", flex: 1, lineHeight: 1.6 }}>
                            {track.description}
                        </p>

                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1.5rem",
                            marginBottom: "1.5rem",
                            fontSize: "0.9rem",
                            color: "var(--muted)"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <BookOpen size={16} />
                                <span>{track._count.modules} Modules</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Clock size={16} />
                                <span>Self-paced</span>
                            </div>
                        </div>

                        <EnrollButton trackId={track.id} />
                    </div>
                ))}

                {tracks.length === 0 && (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem", backgroundColor: "var(--muted-light)", borderRadius: "var(--radius)" }}>
                        <h3 style={{ marginBottom: "1rem" }}>No tracks available yet</h3>
                        <p style={{ color: "var(--muted)" }}>Check back soon! We are working hard to create amazing content for you.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
