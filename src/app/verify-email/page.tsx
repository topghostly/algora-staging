"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { update } = useSession();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          toast.success("Email verified successfully!");

          await signIn("credentials", {
            token,
            redirect: false,
          });

          setTimeout(() => {
            router.push("/dashboard");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to verify email.");
          // Log out the user if verification fails as requested
          await signOut({ redirect: false });
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      {status === "loading" && (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h1 className="text-2xl font-bold mb-2">Verifying Email</h1>
          <p className="text-muted-foreground">{message}</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="text-green-500 mb-4" size={45} />
          <h1 className="text-2xl font-bold">Email Verified!</h1>
          <p className="text-muted-foreground mb-6">{message}</p>

          <Link href="/dashboard" className="btn btn-primary mt-4">
            Go to Dashboard
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="text-red-500 mb-4" size={45} />
          <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
          <p className="text-muted-foreground mb-6">{message}</p>
          <Link href="/auth/signin" className="btn btn-outline">
            Back to Sign In
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div
      className="container"
      style={{
        maxWidth: "420px",
        margin: "2rem auto",
      }}
    >
      <Suspense
        fallback={
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin" />
          </div>
        }
      >
        <div className="card">
          <VerifyEmailContent />
        </div>
      </Suspense>
    </div>
  );
}
