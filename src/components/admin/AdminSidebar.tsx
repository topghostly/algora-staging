"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { ConfirmationDialog } from "../ui/alert-dialog";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Tracks",
    href: "/admin/tracks",
    icon: BookOpen,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

  return (
    <aside
      style={{
        width: "250px",
        backgroundColor: "var(--background)",
        borderRight: "1px solid var(--border)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ marginBottom: "2rem", paddingLeft: "0.75rem" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 500,
            color: "var(--primary)",
          }}
        >
          Algora Admin
        </h2>
      </div>

      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem",
                borderRadius: "var(--radius)",
                color: isActive ? "var(--primary)" : "var(--muted)",
                backgroundColor: isActive
                  ? "var(--primary-light)"
                  : "transparent",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
            >
              <item.icon size={20} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* <button
        onClick={() => setIsSignOutDialogOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.75rem",
          borderRadius: "var(--radius)",
          color: "var(--error)",
          backgroundColor: "transparent",
          border: "none",
          fontWeight: 500,
          cursor: "pointer",
          marginTop: "auto",
        }}
      >
        <LogOut size={20} />
        Sign Out
      </button> */}

      <ConfirmationDialog
        isOpen={isSignOutDialogOpen}
        onOpenChange={setIsSignOutDialogOpen}
        title="Sign Out"
        description="Are you sure you want to sign out of the admin panel?"
        confirmText="Sign Out"
        onConfirm={() => signOut({ callbackUrl: "/auth/signin" })}
        variant="destructive"
      />
    </aside>
  );
}
