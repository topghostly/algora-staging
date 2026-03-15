"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GlowingButton from "@/components/GlowingButton";

export default function PlaygroundNav() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <nav className="flex items-center justify-between px-4 py-2 opacity-50 pointer-events-none">
        <div className="flex items-center gap-1">
          <div className="w-[50px] h-[50px] bg-muted animate-pulse rounded-md" />
        </div>
        <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
      </nav>
    );
  }

  if (status === "unauthenticated") {
    router.replace("/auth/signin");
    return null;
  }

  if (!session) return null;

  return (
    <nav className="flex items-center justify-between px-5 md:px-10 py-2">
      <div className="flex items-center gap-1">
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <div style={{ position: "relative", width: "100px", height: "50px" }}>
            <Image
              src="/logo-long.png"
              alt="Algora Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <GlowingButton href="/dashboard" bg="#060B18" textColor="white">
            Dashboard
          </GlowingButton>
        </div>
        <Image
          src={
            session.user.image
              ? session.user.image
              : "/images/default_profile.png"
          }
          alt=""
          width={30}
          height={30}
          className="rounded-full"
        />
      </div>
    </nav>
  );
}
