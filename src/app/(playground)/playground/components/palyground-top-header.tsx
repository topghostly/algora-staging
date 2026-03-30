"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { T } from "./constants";

const TECH_MAP: Record<string, { name: string; icon: string; color: string }> =
  {
    dbt: { name: "dbt (Data Build Tool)", icon: "🏗️", color: T.teal },
    sql: { name: "SQL Analytics", icon: "🐘", color: T.orange },
    python: { name: "Data with Python", icon: "🐍", color: T.yellow },
    airflow: { name: "Apache Airflow", icon: "💨", color: T.pink },
  };

interface PlaygroundTopHeaderProps {
  onBack?: () => void;
  backText?: string;
  children?: React.ReactNode;
}

function PlaygroundTopHeader({
  onBack,
  backText = "Main List",
  children,
}: PlaygroundTopHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Extract tech slug from /playground/[tech]/...
  const techSlug = pathname?.split("/")[2];
  const tech = techSlug ? TECH_MAP[techSlug] : null;

  return (
    <div
      style={{
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        borderBottom: `1px solid ${T.slate}30`,
        background: "rgba(7, 11, 24, 0.7)",
      }}
    >
      <button
        onClick={() => (onBack ? onBack() : router.push("/playground"))}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 12px",
          borderRadius: 8,
          border: `1px solid ${T.slate}`,
          background: "rgba(255,255,255,0.04)",
          color: T.grey,
          fontSize: 11,
          cursor: "pointer",
          fontFamily: "'JetBrains Mono',monospace",
          transition: "all 0.18s",
        }}
      >
        ← {backText}
      </button>

      {tech && (
        <>
          <div style={{ width: 1, height: 16, background: T.slate }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              animation: "slideIn 0.3s ease",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: `${tech.color}15`,
                border: `1px solid ${tech.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              {tech.icon}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#f1f5f9",
                fontFamily: "'Bricolage Grotesque',sans-serif",
                letterSpacing: -0.3,
              }}
            >
              {tech.name}
            </div>
            <div
              style={{
                fontSize: 9,
                padding: "2px 8px",
                borderRadius: 10,
                background: `${tech.color}10`,
                color: tech.color,
                border: `1px solid ${tech.color}20`,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              LIVE
            </div>
          </div>
        </>
      )}

      {children}
    </div>
  );
}

export default PlaygroundTopHeader;
