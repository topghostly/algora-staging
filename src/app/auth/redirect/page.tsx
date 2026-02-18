"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated" || !session) return;

    switch (session.user.role) {
      case "ADMIN":
        router.replace("/admin");
        break;
      case "TUTOR":
        router.replace("/tutor");
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
