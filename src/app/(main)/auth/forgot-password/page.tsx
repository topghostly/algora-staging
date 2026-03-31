"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success(data.message, {
        duration: 5000,
      });
    } catch (err: any) {
      toast.error(err.message);
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

  return (
    <div>
      <div style={containerStyle} className="card">
        <h3 className="text-center">Reset Password</h3>
        <p className="text-center text-muted-foreground mb-6">
          Enter your email to receive a reset link
        </p>

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
              Email
            </label>
            <input
              type="email"
              placeholder="m@example.com"
              className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-fit mx-auto rounded-md"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.9rem",
          }}
        >
          Remember your password?{" "}
          <Link href="/auth/signin" style={{ textDecoration: "underline" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
