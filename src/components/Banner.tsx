"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";

const AUTH_PATHS = ["/auth", "/email-not-verified"];

interface BannerData {
  id: string;
  message: string;
  href: string | null;
}

const DISMISSED_KEY_PREFIX = "banner_dismissed_";

export default function Banner() {
  const pathname = usePathname();
  const [banner, setBanner] = useState<BannerData | null>(null);
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (isAuthPage) return;

    fetch("/api/banner")
      .then((res) => {
        if (!res.ok) return null;
        return res.json() as Promise<BannerData | null>;
      })
      .then((data) => {
        // Purge all stale dismissed keys that don't match the current banner
        Object.keys(localStorage)
          .filter(
            (key) =>
              key.startsWith(DISMISSED_KEY_PREFIX) &&
              key !== `${DISMISSED_KEY_PREFIX}${data?.id}`,
          )
          .forEach((key) => localStorage.removeItem(key));

        if (!data) return;
        const dismissed = localStorage.getItem(
          `${DISMISSED_KEY_PREFIX}${data.id}`,
        );
        if (!dismissed) setBanner(data);
      })
      .catch(() => {});
  }, [isAuthPage]);

  function dismiss() {
    if (!banner) return;
    localStorage.setItem(`${DISMISSED_KEY_PREFIX}${banner.id}`, "1");
    setBanner(null);
  }

  if (isAuthPage || !banner) return null;

  const message = (
    <span className="site-banner__message">{banner.message}</span>
  );

  return (
    <div className="site-banner" role="banner" aria-live="polite">
      {banner.href ? (
        <Link href={banner.href} className="site-banner__link">
          {message}
        </Link>
      ) : (
        <div className="site-banner__static text-lg">{message}</div>
      )}

      <button
        onClick={dismiss}
        className="site-banner__close"
        aria-label="Dismiss banner"
      >
        <X size={15} strokeWidth={2.5} />
      </button>
    </div>
  );
}
