"use client";
import React, { useState } from "react";
import Link from "next/link";
import { T, GLOBAL_STYLES } from "./components/constants";

const TECHNOLOGIES = [
  {
    id: "dbt",
    name: "dbt (Data Build Tool)",
    description: "Learn dbt from scratch with interactive courses.",
    icon: "🏗️",
    color: T.teal,
    href: "/playground/dbt",
    active: true,
  },
  {
    id: "sql",
    name: "SQL Analytics",
    description: "Master advanced SQL querying for data analysis.",
    icon: "🐘",
    color: T.orange,
    href: "/playground/sql",
    active: true,
  },
  {
    id: "python",
    name: "Data with Python",
    description: "Pandas, PySpark, and data engineering in Python.",
    icon: "🐍",
    color: T.yellow,
    href: "/playground/python",
    active: false,
  },
  {
    id: "airflow",
    name: "Apache Airflow",
    description: "Orchestrate complex data pipelines step by step.",
    icon: "💨",
    color: T.pink,
    href: "/playground/airflow",
    active: false,
  },
];

export default function TechSelectorPage() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div
        style={{
          minHeight: "100vh",
          color: "#f1f5f9",
          fontFamily: "'Onest',sans-serif",
        }}
      >
        {/* Hero */}
        <div
          style={{
            padding: "56px 32px 40px",
            textAlign: "center",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: T.tealBg,
              border: T.tealBorder,
              borderRadius: 20,
              padding: "5px 16px",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: T.teal,
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: T.teal,
                fontFamily: "'JetBrains Mono',monospace",
                letterSpacing: 0.5,
              }}
            >
              Interactive Playgrounds
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontSize: "clamp(30px,5vw,50px)",
              fontWeight: 800,
              margin: "0 0 14px",
              lineHeight: 1.1,
              letterSpacing: -1,
            }}
          >
            Choose your{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              technology
            </span>
          </h1>
          <p
            style={{
              color: T.grey,
              fontSize: 14,
              maxWidth: 500,
              margin: "0 auto 28px",
              lineHeight: 1.75,
            }}
          >
            Dive into structured, interactive environments to master the modern
            data stack. Select a technology to begin.
          </p>
        </div>

        {/* Tech Grid */}
        <div
          style={{
            padding: "40px 24px 60px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 16,
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {TECHNOLOGIES.map((tech, i) => {
            const isHovered = hovered === tech.id;
            const CardMarkup = (
              <div
                onMouseEnter={() => setHovered(tech.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background:
                    isHovered && tech.active
                      ? "rgba(15,23,42,0.98)"
                      : T.surface,
                  border: `1px solid ${
                    isHovered && tech.active
                      ? tech.color + "44"
                      : "rgba(255,255,255,0.07)"
                  }`,
                  borderRadius: 14,
                  padding: "24px",
                  cursor: tech.active ? "pointer" : "not-allowed",
                  opacity: tech.active ? 1 : 0.6,
                  transition: "all 0.2s",
                  transform:
                    isHovered && tech.active
                      ? "translateY(-4px)"
                      : "translateY(0)",
                  boxShadow:
                    isHovered && tech.active
                      ? `0 10px 32px ${tech.color}14`
                      : "none",
                  animation: `fadeUp 0.4s ease both`,
                  animationDelay: `${i * 40}ms`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {!tech.active && (
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      fontSize: 10,
                      background: "rgba(255,255,255,0.1)",
                      color: T.grey,
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontFamily: "monospace",
                    }}
                  >
                    Coming Soon
                  </div>
                )}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${tech.color}15`,
                    border: `1px solid ${tech.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  {tech.icon}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#f1f5f9",
                      fontFamily: "'Bricolage Grotesque',sans-serif",
                      margin: "0 0 4px 0",
                    }}
                  >
                    {tech.name}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: T.grey,
                      lineHeight: 1.5,
                    }}
                  >
                    {tech.description}
                  </p>
                </div>
              </div>
            );

            if (tech.active) {
              return (
                <Link
                  href={tech.href}
                  key={tech.id}
                  style={{ textDecoration: "none" }}
                >
                  {CardMarkup}
                </Link>
              );
            }
            return <React.Fragment key={tech.id}>{CardMarkup}</React.Fragment>;
          })}
        </div>
      </div>
    </>
  );
}
