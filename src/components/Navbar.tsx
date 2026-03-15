"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Layers,
  Video,
  Briefcase,
  User,
  LogOut,
  LayoutDashboard,
  Coins,
} from "lucide-react";
import { useState } from "react";
import Dropdown from "./ui/Dropdown";
import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "./ui/alert-dialog";

import { Badge } from "@/components/ui/badge";
import GlowingButton from "./GlowingButton";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
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
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px",
          paddingLeft: "clamp(1rem, 5vw, 2rem)",
          paddingRight: "clamp(1rem, 5vw, 2rem)",
        }}
      >
        <div className="flex items-center gap-1">
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <div
              style={{ position: "relative", width: "50px", height: "50px" }}
            >
              <Image
                src="/logo-n.png"
                alt="Algora Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>
          {session && (
            <div className="mr-2">
              <Badge variant="outline" className="rounded-full">
                {session?.user.role}
              </Badge>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <div
          className="desktop-nav"
          style={{ display: "flex", alignItems: "center", gap: "2rem" }}
        >
          {session ? (
            <div className="flex items-center gap-3">
              {session.user.role === "LEARNER" && (
                <GlowingButton href={"/playground"} initialAnimation={true}>
                  Playground
                </GlowingButton>
              )}

              <div>
                <Image
                  src={
                    session.user.image
                      ? session.user.image
                      : "/images/default_profile.png"
                  }
                  alt=""
                  width={35}
                  height={35}
                  className="rounded-full"
                />
              </div>

              <Dropdown
                position="below"
                align="end"
                trigger={
                  <div
                    style={{
                      width: "40px",
                      height: "35px",
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
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin">
                      <div className="dropdown-item">
                        <Layers size={16} />
                        <span>Admin</span>
                      </div>
                    </Link>
                  )}

                  {session.user.role === "LEARNER" && (
                    <>
                      {/* <div className="block sm:hidden"> */}
                      <Link href="/dashboard">
                        <div className="dropdown-item">
                          <LayoutDashboard size={16} />
                          <span>Dashboard</span>
                        </div>
                      </Link>
                      {/* </div> */}
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
                    </>
                  )}

                  {session.user.role === "TUTOR" && (
                    <Link href="/tutor">
                      <div className="dropdown-item">
                        <Layers size={16} />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                  )}

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
                    onClick={() => setIsSignOutDialogOpen(true)}
                    className="dropdown-item dropdown-item-signout"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </Dropdown>
            </div>
          ) : (
            <div>
              <div className="items-center gap-2 hidden sm:flex">
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
                <Link
                  href="/auth/signup"
                  className="btn btn-primary rounded-full"
                >
                  Get Started
                </Link>
              </div>

              <div className="block sm:hidden">
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
                    <Link href="/pricing">
                      <div className="dropdown-item">
                        <Coins size={16} />
                        <span>Pricing</span>
                      </div>
                    </Link>
                    <div
                      style={{
                        margin: "0.5rem 0",
                        borderTop: "1px solid var(--border)",
                      }}
                    />

                    <button
                      onClick={() => router.push("/auth/signup")}
                      className="dropdown-item dropdown-item-started"
                    >
                      <LogOut size={16} />
                      <span>Get Started</span>
                    </button>
                  </div>
                </Dropdown>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button - Only show for non-authenticated users */}
      </div>

      <ConfirmationDialog
        isOpen={isSignOutDialogOpen}
        onOpenChange={setIsSignOutDialogOpen}
        title="Sign Out"
        description="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        onConfirm={() => {
          router.push("/auth/signin");
          signOut();
        }}
        variant="destructive"
      />

      <style jsx>{`
        .desktop-nav {
          display: flex;
        }
        .mobile-menu-btn {
          display: none;
        }
        // @media (max-width: 768px) {
        //   .desktop-nav {
        //     display: none !important;
        //   }
        //   .mobile-menu-btn {
        //     display: block !important;
        //   }
        // }
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
        .dropdown-item-started {
          width: calc(100% - 1rem);
          text-align: left;
          background: #00897b23;
          border: none;
          cursor: pointer;
          color: #00897b;
          margin-top: 0.25rem;
        }
        .dropdown-item-started:hover {
          background-color: #00897b23 !important;
          color: #00897b !important;
        }
      `}</style>
    </nav>
  );
}
