"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Layers, Video, Briefcase, User, LogOut } from "lucide-react";
import { useState } from "react";
import Dropdown from "./ui/Dropdown";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav
      style={{
        borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--background)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        // className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "70px",
          padding: "0 2rem",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <div style={{ position: "relative", width: "50px", height: "50px" }}>
            <Image
              src="/logo.png"
              alt="Algora Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div
          className="desktop-nav"
          style={{ display: "flex", alignItems: "center", gap: "2rem" }}
        >
          {session ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link
                href="/dashboard"
                style={{ fontWeight: 500, color: "var(--muted)" }}
                className="btn-outline btn"
              >
                Dashboard
              </Link>

              <Dropdown
                position="below"
                align="end"
                trigger={
                  <div
                    style={{
                      width: "45px",
                      height: "40px",
                      borderRadius: "4px",
                      overflow: "hidden",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid var(--border)",
                      cursor: "pointer",
                    }}
                  >
                    <Menu size={20} />
                  </div>
                }
              >
                <div
                  style={{
                    padding: "0.5rem 0",
                    display: "flex",
                    flexDirection: "column",
                    minWidth: "220px",
                    backgroundColor: "var(--background)",
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Link href="/tracks">
                    <div className="dropdown-item">
                      <Layers size={16} />
                      <span>Tracks</span>
                    </div>
                  </Link>

                  <Link href="/dashboard/sessions">
                    <div className="dropdown-item">
                      <Video size={16} />
                      <span>Sessions</span>
                    </div>
                  </Link>

                  <Link href="/dashboard/projects">
                    <div className="dropdown-item">
                      <Briefcase size={16} />
                      <span>Projects</span>
                    </div>
                  </Link>

                  <Link href="/dashboard/profile">
                    <div className="dropdown-item">
                      <User size={16} />
                      <span>Profile</span>
                    </div>
                  </Link>

                  <div
                    style={{
                      margin: "0.5rem 0",
                      borderTop: "1px solid var(--border)",
                    }}
                  />

                  <button
                    onClick={() => {
                      signOut();
                      router.push("/auth/signin");
                    }}
                    className="dropdown-item dropdown-item-signout"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </Dropdown>
            </div>
          ) : (
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Link
                href="/tracks"
                style={{ fontWeight: 500, color: "var(--muted)" }}
                className="btn"
              >
                Tracks
              </Link>
              <Link
                href="/pricing"
                style={{ fontWeight: 500, color: "var(--muted)" }}
                className="btn"
              >
                Pricing
              </Link>
              {/* <Link
                href="/auth/signin"
                style={{ fontWeight: 500, color: "var(--foreground)" }}
                className="btn btn-outline"
              >
                Sign In
              </Link> */}
              <Link href="/auth/signup" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button - Only show for non-authenticated users */}
        {!session && (
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            backgroundColor: "var(--background)",
          }}
        >
          <Link href="/tracks" onClick={() => setIsMenuOpen(false)}>
            Tracks
          </Link>
          <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>
            Pricing
          </Link>
          <Link href="/dashboard/sessions" onClick={() => setIsMenuOpen(false)}>
            Sessions
          </Link>
          <hr
            style={{ border: "none", borderTop: "1px solid var(--border)" }}
          />
          {session ? (
            <>
              {(session.user as any).role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ color: "var(--primary)", fontWeight: 600 }}
                >
                  Admin
                </Link>
              )}
              {((session.user as any).role === "TUTOR" ||
                (session.user as any).role === "ADMIN") && (
                <Link
                  href="/tutor"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ color: "var(--primary)", fontWeight: 600 }}
                >
                  Tutor
                </Link>
              )}
              <Link
                href="/dashboard/profile"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                style={{
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="btn btn-primary"
                style={{ textAlign: "center" }}
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .desktop-nav {
          display: flex;
        }
        .mobile-menu-btn {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 1rem;
          font-size: 0.875rem;
          color: var(--foreground);
          transition: all 0.2s ease;
          text-decoration: none;
          border-radius: 8px;
          margin: 0 0.5rem;
          cursor: pointer;
        }
        .dropdown-item:hover {
          background-color: var(--muted-light);
        }
        .dropdown-item-signout {
          width: calc(100% - 1rem);
          text-align: left;
          background: #fef2f2;
          border: none;
          cursor: pointer;
          color: #ef4444;
          margin-top: 0.25rem;
        }
        .dropdown-item-signout:hover {
          background-color: #fee2e2 !important;
          color: #dc2626 !important;
        }
      `}</style>
    </nav>
  );
}
