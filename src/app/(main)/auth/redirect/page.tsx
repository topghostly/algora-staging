"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated" || !session) return;

    if (!session.user.role) {
      router.replace("/auth/select-role");
      return;
    }

    switch (session.user.role) {
      case "ADMIN":
        router.replace("/admin");
        break;
      case "TUTOR": {
        if (!session.user.hasCompletedOnboarding) {
          router.replace("/tutor/onboarding");
        } else if (
          session.user.tutorStatus === "PENDING" ||
          session.user.tutorStatus === "REJECTED"
        ) {
          router.replace("/tutor/pending");
        } else {
          router.replace("/tutor");
        }
        break;
      }
      case "LEARNER":
        router.replace("/dashboard");
        break;
      default:
        router.replace("/dashboard");
    }
  }, [status, session, router]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "4rem" }}>
      Signing you in…
    </div>
  );
}
