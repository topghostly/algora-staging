"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LottieAnimation } from "@/components/NotFoundAnimation";

export default function EmailNotVerifiedPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
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
        margin: "2rem auto",
      }}
    >
      <div className=" min-h-[80vh] mx-auto flex justify-center items-center flex-col text-center">
        <div className="flex mx-auto h-50 w-50 md:h-60 md:w-60 items-center justify-center overflow-hidden mb-6 scale-150">
          <LottieAnimation
            jsonPath="/json/email.json"
            fallbackWebm="/videos/empty.webm"
          />
        </div>
        <h2 className="mb-4">Verify your email</h2>

        <p className="text-muted-foreground mb-4 max-w-[500px]">
          We've sent a verification link to{" "}
          <strong>{session?.user?.email}</strong>. Please check your inbox and
          verify your account to access all features.
        </p>

        <div className="flex flex-col gap-3 mb-8">
          <Button
            variant={"outline"}
            onClick={handleResendEmail}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader
                  size={16}
                  className="animate-spin"
                  style={{ marginRight: "0.4rem" }}
                />
                Sending...
              </>
            ) : (
              "Resend Verification Email"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
