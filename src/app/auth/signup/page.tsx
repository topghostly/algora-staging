"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // If a plan was selected, redirect to login with callback to pricing
        // Otherwise just go to login
        const callbackUrl = plan ? encodeURIComponent("/pricing") : "";
        const redirectUrl = plan
          ? `/auth/signin?callbackUrl=${callbackUrl}&registered=true`
          : `/auth/signin?registered=true`;

        router.push(redirectUrl);
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "4rem" }}>
      <div className="card">
        <h1 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          Create Account
        </h1>

        {error && (
          <div
            style={{
              backgroundColor: "#FEF2F2",
              color: "var(--error)",
              padding: "0.75rem",
              borderRadius: "var(--radius)",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                fontSize: "1rem",
              }}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Email
            </label>
            <input
              type="email"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                fontSize: "1rem",
              }}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Password
            </label>
            <input
              type="password"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                fontSize: "1rem",
              }}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: "0.5rem" }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.9rem",
            color: "var(--muted)",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            style={{ color: "var(--primary)", fontWeight: 500 }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
