"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSocialHovered, setIsSocialHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "OAuthAccountNotLinked") {
      toast.error(
        "Account already exists. Please sign in with your email and password.",
      );
    }
  }, [searchParams]);

  useEffect(() => {
    console.log(`The first part status: ${status} and the session: ${session}`);
    if (status !== "authenticated") return;

    toast.success("Welcome back!", {
      description: "You've successfully signed in.",
    });

    if (callbackUrl) {
      router.replace(callbackUrl);
      return;
    }

    const role = session?.user?.role;
    console.log(`The third part role: ${role}`);

    if (!role) {
      router.replace("/auth/select-role");
      return;
    }

    if (role === "TUTOR") router.replace("/tutor");
    else if (role === "LEARNER") router.replace("/dashboard");
    else if (role === "ADMIN") router.replace("/admin");
  }, [status, session, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    console.log(`The second part res: ${res}`);

    if (res?.error) {
      const errorMessage = "Invalid email or password";
      setError(errorMessage);
      toast.error("Sign in failed", {
        description: errorMessage,
      });
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", {
      callbackUrl: callbackUrl || "/auth/redirect",
    });
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "420px",
    margin: "2rem auto",
    border: "none",
    boxShadow: "none",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.8rem",
    backgroundColor: "#1A1A1A",
    border: "1px solid #333",
    borderRadius: "8px",
    color: "#fff",
    marginTop: "0.5rem",
    fontSize: "0.95rem",
  };

  const socialBtnStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    cursor: "pointer",
    fontSize: "0.95rem",
    marginBottom: "0.75rem",
    boxShadow: isSocialHovered
      ? "0 2px 9px rgba(0, 0, 0, 0.1)"
      : "0 1px 3px rgba(0, 0, 0, 0.05)",
    transition: "all 0.2s ease",
  };

  return (
    <div>
      <div style={containerStyle} className="card">
        <h1
          style={{
            textAlign: "center",
            fontSize: "1.6rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Welcome back
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "var(--muted)",
            marginBottom: "2rem",
          }}
        >
          Login with your Google account
        </p>
        <button
          style={socialBtnStyle}
          onClick={handleGoogleSignIn}
          onMouseEnter={() => setIsSocialHovered(true)}
          onMouseLeave={() => setIsSocialHovered(false)}
        >
          <span style={{ width: "20px", height: "20px" }}>
            <svg
              width="20px"
              height="20px"
              viewBox="-3 0 262 262"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
            >
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              />
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              />
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              />
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              />
            </svg>
          </span>{" "}
          Sign in with Google
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "1.5rem 0",
            color: "#444",
          }}
        >
          <div
            style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }}
          />
          <span
            style={{
              padding: "0 10px",
              fontSize: "0.8rem",
              color: "var(--muted)",
            }}
          >
            Or continue with
          </span>
          <div
            style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }}
          />
        </div>

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
        {success && (
          <p
            style={{
              color: "#32D74B",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            {success}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
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
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                style={{
                  fontSize: "0.8rem",
                  textDecoration: "underline",
                  fontWeight: 500,
                }}
              >
                Forgot your password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.9rem",
          }}
        >
          Don't have an account?{" "}
          <Link href="/auth/signup" style={{ textDecoration: "underline" }}>
            Sign up
          </Link>
        </p>
      </div>
      <p
        style={{
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#666",
          lineHeight: "1.4",
        }}
      >
        By clicking continue, you agree to our <br />
        <Link href="#" style={{ fontWeight: 600, textDecoration: "underline" }}>
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          style={{ fontWeight: 600, textDecoration: "underline" }}
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div style={{ color: "white", textAlign: "center", marginTop: "4rem" }}>
          Loading...
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
