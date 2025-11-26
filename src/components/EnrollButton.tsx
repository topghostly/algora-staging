"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function EnrollButton({ trackId }: { trackId: string }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);

    const handleEnroll = async () => {
        if (!session) {
            router.push("/auth/signin");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trackId }),
            });

            if (res.ok) {
                router.push("/dashboard");
                router.refresh();
            } else {
                console.error("Enrollment failed");
            }
        } catch (error) {
            console.error("Error enrolling:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleEnroll}
            disabled={loading}
            className="btn btn-primary"
            style={{
                width: "100%",
                justifyContent: "center",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1
            }}
        >
            {loading ? (
                <>
                    <Loader2 size={18} className="animate-spin" style={{ marginRight: "0.5rem" }} />
                    Enrolling...
                </>
            ) : (
                <>
                    Start Track <ArrowRight size={18} style={{ marginLeft: "0.5rem" }} />
                </>
            )}
        </button>
    );
}
