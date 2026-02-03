"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const verifiedRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session) return;

    if (session.user.emailVerified) {
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
    } else {
      const run = async () => {
        if (!verifiedRef.current) {
          verifiedRef.current = true;

          try {
            await fetch("/api/auth/verify-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ googleMail: session.user.email }),
            });
          } catch (err) {
            console.error(err);
          }
        }

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
      };

      run();
    }
  }, [status, session, router]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "4rem" }}>
      Signing you in…
    </div>
  );
}
