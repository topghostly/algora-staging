"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Missing reset token");
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

      setMessage(data.message);
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
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
      <div style={containerStyle} className="card">
        <h1
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Invalid Link
        </h1>
        <p style={{ textAlign: "center", color: "var(--muted)" }}>
          This password reset link is invalid or missing a token.
        </p>
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link
            href="/auth/forgot-password"
            style={{ textDecoration: "underline" }}
          >
            Request a new link
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={containerStyle} className="card">
        <h1
          style={{
            textAlign: "center",
            fontSize: "1.4rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Set New Password
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "var(--muted)",
            marginBottom: "2rem",
          }}
        >
          Please enter your new password below
        </p>

        {error && (
          <p
            style={{
              color: "#FF453A",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </p>
        )}
        {message && (
          <p
            style={{
              color: "#32D74B",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            {message}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div>
            <label
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              New Password
            </label>
            <input
              type="password"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                fontSize: "1rem",
                marginTop: "0.6rem",
              }}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                fontSize: "1rem",
                marginTop: "0.6rem",
              }}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.8rem",
              borderRadius: "var(--radius)",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "var(--background)",
              fontWeight: 600,
              cursor: "pointer",
              marginTop: "0.5rem",
            }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div style={{ color: "white", textAlign: "center", marginTop: "4rem" }}>
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
