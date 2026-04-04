"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, Loader, CheckCircle, XCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please ensure both passwords are identical.",
      });
      setLoading(false);
      return;
    }

    if (!token) {
      toast.error("Missing reset token", {
        description: "The reset link is invalid or has expired.",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success("Password Reset Successful!", {
        description:
          "Your password has been updated. Redirecting to sign in...",
      });

      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (err: any) {
      toast.error("Reset Failed", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "420px",
    margin: "2rem auto",
    border: "none",
    boxShadow: "none",
  };

  if (!token) {
    return (
      <div
        style={containerStyle}
        className="card flex flex-col items-center justify-center text-center"
      >
        <XCircle className="text-red-500 mb-4" size={40} strokeWidth={1.5} />
        <h3 className="mb-2">Invalid Link</h3>
        <p className="text-muted-foreground mb-6">
          This password reset link is invalid or missing a token.
        </p>
        <Link
          href="/auth/forgot-password"
          className="btn btn-outline rounded-md"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="card">
      <h3 className="text-center mb-1">Set New Password</h3>
      <p className="text-center text-muted-foreground mb-8">
        Please enter your new password below
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full h-10 pl-3 pr-10 py-2 bg-background rounded-lg text-sm border-2 border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full h-10 pl-3 pr-10 py-2 bg-background rounded-lg text-sm border-2 border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full rounded-md mt-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              Resetting...
            </span>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center mt-16">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
