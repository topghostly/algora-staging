"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Menu, User, X } from "lucide-react";
import { useState } from "react";
import Dropdown from "./ui/Dropdown";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          {/* <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            Algora
          </span> */}
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
              >
                Dashboard
              </Link>

              <Dropdown
                position="below"
                trigger={
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      //   border: "2px solid var(--border)",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "var(--primary-light)",
                    }}
                  >
                    <User size={25} className="text-primary" />
                  </div>
                }
                dropdownClassName="right-0 translate-x-0"
              >
                <div
                  style={{
                    padding: "0.5rem 0",
                    display: "flex",
                    flexDirection: "column",
                    minWidth: "200px",
                    backgroundColor: "var(--background)",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                  }}
                >
                  {/* <div
                    style={{
                      padding: "0.5rem 1rem",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#888",
                      textTransform: "uppercase",
                    }}
                  >
                    My Account
                  </div> */}

                  <Link href="/tracks">
                    <div className="dropdown-item">Tracks</div>
                  </Link>

                  <Link href="/dashboard/sessions">
                    <div className="dropdown-item">Sessions</div>
                  </Link>

                  <Link href="/dashboard/projects">
                    <div className="dropdown-item">Projects</div>
                  </Link>

                  <Link href="/dashboard/profile">
                    <div className="dropdown-item">Profile</div>
                  </Link>

                  <hr
                    style={{
                      margin: "0",
                      border: "none",
                      borderTop: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />

                  <button
                    onClick={() => signOut()}
                    className="dropdown-item dropdown-item-signout"
                  >
                    Sign Out
                  </button>
                </div>
              </Dropdown>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
              <Link
                href="/tracks"
                style={{ fontWeight: 500, color: "var(--muted)" }}
              >
                Tracks
              </Link>
              <Link
                href="/pricing"
                style={{ fontWeight: 500, color: "var(--muted)" }}
              >
                Pricing
              </Link>
              <Link
                href="/auth/signin"
                style={{ fontWeight: 500, color: "var(--foreground)" }}
              >
                Sign In
              </Link>
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
          display: block;
          padding: 0.625rem 1rem;
          font-size: 0.9375rem;
          color: var(--foreground);
          transition: all 0.2s ease;
          text-decoration: none;
          border-radius: 6px;
          margin: 0 0.5rem;
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
