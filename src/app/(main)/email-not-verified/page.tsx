"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Mail, Loader, ArrowRight, MoveLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EmailNotVerifiedPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // console.log(!!session?.user?.emailVerified);
    if (session?.user?.emailVerified) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      if (!session?.user?.email) return;

      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Verification email sent!");
      } else {
        toast.error(data.error || "Failed to send email.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container px-page"
      style={{
        maxWidth: "520px",
        margin: "2rem auto",
      }}
    >
      <div className="card" style={{ border: "none", boxShadow: "none" }}>
        <div className="mb-10">
          {" "}
          <Link
            href="/tracks"
            style={{
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <MoveLeft size={16} />
            Back to Tracks
          </Link>
        </div>

        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          Verify your email
        </h1>

        <p className="text-muted-foreground mb-8 text-xl">
          We've sent a verification link to{" "}
          <strong>{session?.user?.email}</strong>. Please check your inbox and
          verify your account to access all features.
        </p>

        <div className="flex flex-col gap-3 mb-8">
          <button
            onClick={handleResendEmail}
            disabled={loading}
            className="btn btn-primary rounded-lg"
            style={{
              padding: "10px 20px",
              width: "fit-content",
              justifyContent: "center",
            }}
          >
            {loading ? <><Loader size={16} className="animate-spin" style={{ marginRight: "0.4rem" }} />Sending...</> : "Resend Verification Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
