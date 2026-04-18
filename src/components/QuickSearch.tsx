"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Kbd } from "./ui/kbd";
import { motion, AnimatePresence } from "framer-motion";

type PageLink = {
  title: string;
  href: string;
  description: string;
  roles: string[];
};

const pages: PageLink[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "Overview of your progress and active tracks",
    roles: ["LEARNER", "ADMIN"],
  },
  {
    title: "Tracks",
    href: "/tracks",
    description: "Browse and enroll in new learning paths",
    roles: ["LEARNER", "ADMIN", "TUTOR", "GUEST"],
  },
  {
    title: "SQL Playground",
    href: "/playground",
    description: "Practice your SQL skills in a live environment",
    roles: ["LEARNER", "ADMIN", "TUTOR"],
  },
  {
    title: "Pricing",
    href: "/pricing",
    description: "View our subscription plans and features",
    roles: ["LEARNER", "ADMIN", "TUTOR", "GUEST"],
  },
  {
    title: "Admin Panel",
    href: "/admin",
    description: "Manage users, tracks, and system settings",
    roles: ["ADMIN"],
  },
  {
    title: "Tutor Dashboard",
    href: "/tutor",
    description: "Manage your sessions and students",
    roles: ["TUTOR", "ADMIN"],
  },
  {
    title: "My Sessions",
    href: "/tutor/sessions",
    description: "Manage your teaching schedule and sessions",
    roles: ["TUTOR", "ADMIN"],
  },
  {
    title: "Create New Session",
    href: "/tutor/sessions/new",
    description: "Schedule a new tutoring session with a student",
    roles: ["TUTOR", "ADMIN"],
  },
  {
    title: "Student Requests",
    href: "/tutor/request",
    description: "View and respond to 1-on-1 session requests",
    roles: ["TUTOR", "ADMIN"],
  },
  {
    title: "Tutor Profile Setup",
    href: "/tutor/onboarding",
    description: "Complete your tutor profile and specialties",
    roles: ["TUTOR", "ADMIN"],
  },
  {
    title: "Browse Sessions",
    href: "/dashboard/sessions/browse",
    description: "Explore and join available coaching sessions",
    roles: ["LEARNER", "ADMIN"],
  },
  {
    title: "Request a Session",
    href: "/dashboard/sessions/request",
    description: "Request a personalized 1-on-1 coaching session",
    roles: ["LEARNER", "ADMIN"],
  },
  {
    title: "Admin: Users",
    href: "/admin/users",
    description: "Manage system users and their roles",
    roles: ["ADMIN"],
  },
  {
    title: "Admin: Tracks",
    href: "/admin/tracks",
    description: "Manage learning tracks and chapters",
    roles: ["ADMIN"],
  },
  {
    title: "Profile Settings",
    href: "/dashboard/profile",
    description: "Manage your account settings, avatar, and bio",
    roles: ["LEARNER", "ADMIN", "TUTOR"],
  },
  {
    title: "My Sessions",
    href: "/dashboard/sessions",
    description: "View and join your scheduled learning sessions",
    roles: ["LEARNER", "ADMIN"],
  },
  {
    title: "Session History",
    href: "/dashboard/sessions/history",
    description: "View all your past sessions, requests, and their outcomes",
    roles: ["LEARNER", "ADMIN"],
  },
  {
    title: "Privacy Policy",
    href: "/privacy",
    description: "Read our privacy and data protection terms",
    roles: ["LEARNER", "ADMIN", "TUTOR", "GUEST"],
  },
  {
    title: "Terms of Service",
    href: "/terms",
    description: "Read our terms of service",
    roles: ["LEARNER", "ADMIN", "TUTOR", "GUEST"],
  },
];

export function QuickSearch() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Handle click outside to close
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    setSearch("");
    command();
  }, []);

  const userRole = session?.user?.role || "GUEST";

  // Filter pages by role and search query
  const filteredPages = pages.filter((page) => {
    const hasRole = page.roles.includes(userRole as string);
    if (!hasRole) return false;

    if (!search.trim()) return false;

    const searchLower = search.toLowerCase();
    return (
      page.title.toLowerCase().includes(searchLower) ||
      page.description.toLowerCase().includes(searchLower) ||
      page.href.toLowerCase().includes(searchLower)
    );
  });

  if (pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {/* Dark Overlay - only shows when there is an active search */}
        {open && search.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 z-100 backdrop-blur-sm"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div
        ref={containerRef}
        className={cn(
          "relative w-full max-w-2xl transition-all duration-300",
          open ? "z-101" : "z-50",
        )}
      >
        <Command className="rounded-lg border-gray-300 border-2 bg-background overflow-visible">
          <div className="relative flex items-center">
            <CommandInput
              ref={inputRef}
              placeholder="Quick Access"
              value={search}
              onValueChange={(val) => {
                setSearch(val);
                0;
                if (val && !open) setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              className="h-7 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-all border-none focus:ring-0"
            />
            <AnimatePresence>
              {!open && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-1.5 top-[50%] -translate-y-[50%] hidden sm:block"
                >
                  <Kbd className="pointer-events-none h-6 select-none items-center gap-1 rounded-md px-1.5 font-mono text-[10px] font-medium opacity-100 flex bg-input">
                    <span className="text-xs">⌘</span>K
                  </Kbd>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {open && search.trim() && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-xl overflow-hidden"
              >
                <CommandList className="max-h-[400px]">
                  <CommandEmpty className="py-3 text-center text-sm">
                    No results found.
                  </CommandEmpty>
                  <CommandGroup heading="Quick Access" className="p-2">
                    {filteredPages.map((page) => (
                      <CommandItem
                        key={page.href}
                        onSelect={() => {
                          runCommand(() => router.push(page.href));
                        }}
                        className="flex flex-col items-start gap-[2px] py-3 px-4 aria-selected:bg-accent aria-selected:text-accent-foreground rounded-md cursor-pointer transition-colors"
                      >
                        <span className="font-medium">{page.title}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {page.description}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </motion.div>
            )}
          </AnimatePresence>
        </Command>
      </div>
    </>
  );
}
