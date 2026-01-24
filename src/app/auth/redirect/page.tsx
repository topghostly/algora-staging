"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    if (session.user.role === "ADMIN") {
      router.replace("/admin");
    } else if (session.user.role === "TUTOR") {
      router.replace("/tutor");
    } else {
      router.replace("/dashboard");
    }
  }, [session, status]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "4rem" }}>
      Signing you in…
    </div>
  );
}
