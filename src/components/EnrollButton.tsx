"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function EnrollButton({ trackId }: { trackId: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    console.log(session);
    if (!session) {
      toast.error("Please sign in to enroll in a track");
      router.push("/auth/signin");
      return;
    }

    if (!(session.user as any).emailVerified) {
      toast.error("Please verify your email to enroll in a track");
      router.push("/email-not-verified");
      return;
    }

    if (
      (session.user as any).role === "TUTOR" &&
      (session.user as any).tutorStatus !== "APPROVED"
    ) {
      toast.error(
        "Your tutor application is not approved yet. Please wait for approval.",
      );
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
        if ((session.user as any).role === "TUTOR") {
          router.push("/tutor");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      } else {
        const errorData = await res.text();
        console.error(
          "Enrollment failed. Status:",
          res.status,
          "Body:",
          errorData,
        );
        toast.error(`Enrollment failed: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error enrolling:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleEnroll}
      disabled={loading}
      className="w-fit flex gap-0"
    >
      {loading ? (
        <>
          <Loader
            size={18}
            className="animate-spin"
            style={{ marginRight: "0.5rem" }}
          />
          Enrolling...
        </>
      ) : (
        <>
          Start Track <ArrowRight size={18} style={{ marginLeft: "0.5rem" }} />
        </>
      )}
    </Button>
  );
}
