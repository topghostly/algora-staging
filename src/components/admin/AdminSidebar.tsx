"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-40 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
        aria-label="Open admin menu"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[250px] p-3 bg-background border-r border-border transition-transform duration-300 transform lg:relative lg:translate-x-0 lg:z-auto flex flex-col h-screen ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          style={{
            marginBottom: "2rem",
            paddingLeft: "0.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 500,
              color: "var(--primary)",
            }}
          >
            Algora Admin
          </h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-muted rounded-md transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
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
    </>
  );
}
