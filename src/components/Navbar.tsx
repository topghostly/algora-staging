"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav style={{
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--background)",
            position: "sticky",
            top: 0,
            zIndex: 50
        }}>
            <div className="container" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "70px"
            }}>
                {/* Logo */}
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ position: "relative", width: "40px", height: "40px" }}>
                        <Image
                            src="/logo.png"
                            alt="Algora Logo"
                            fill
                            style={{ objectFit: "contain" }}
                        />
                    </div>
                    <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>
                        Algora
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    <Link href="/tracks" style={{ fontWeight: 500, color: "var(--muted)" }}>Tracks</Link>
                    <Link href="/pricing" style={{ fontWeight: 500, color: "var(--muted)" }}>Pricing</Link>

                    {session ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            {(session.user as any).role === "ADMIN" && (
                                <Link href="/admin" style={{ fontWeight: 500, color: "var(--primary)" }}>
                                    Admin
                                </Link>
                            )}
                            <Link href="/dashboard" className="btn btn-outline">Dashboard</Link>
                            <button
                                onClick={() => signOut()}
                                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontWeight: 500 }}
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <Link href="/auth/signin" style={{ fontWeight: 500, color: "var(--foreground)" }}>Sign In</Link>
                            <Link href="/auth/signup" className="btn btn-primary">Get Started</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div style={{
                    borderTop: "1px solid var(--border)",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    backgroundColor: "var(--background)"
                }}>
                    <Link href="/tracks" onClick={() => setIsMenuOpen(false)}>Tracks</Link>
                    <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                    <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />
                    {session ? (
                        <>
                            {(session.user as any).role === "ADMIN" && (
                                <Link href="/admin" onClick={() => setIsMenuOpen(false)} style={{ color: "var(--primary)", fontWeight: 600 }}>Admin</Link>
                            )}
                            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                            <button onClick={() => signOut()} style={{ textAlign: "left", background: "none", border: "none", padding: 0 }}>Sign Out</button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                            <Link href="/auth/signup" className="btn btn-primary" style={{ textAlign: "center" }} onClick={() => setIsMenuOpen(false)}>Get Started</Link>
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
      `}</style>
        </nav>
    );
}
