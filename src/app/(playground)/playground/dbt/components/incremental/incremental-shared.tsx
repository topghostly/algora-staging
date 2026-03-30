import React, { useState, useEffect } from "react";
import { T } from "../../../components/constants";

export const allRows = [
  { id: 1, event: "page_view", user: "alice", ts: "Jan 1", color: "#4ade80" },
  { id: 2, event: "click", user: "bob", ts: "Jan 2", color: "#4ade80" },
  { id: 3, event: "signup", user: "carol", ts: "Jan 3", color: "#4ade80" },
  { id: 4, event: "purchase", user: "alice", ts: "Jan 4", color: "#4ade80" },
  { id: 5, event: "logout", user: "dave", ts: "Jan 5", color: "#4ade80" },
  { id: 6, event: "page_view", user: "eve", ts: "Jan 6", color: "#4ade80" },
  { id: 7, event: "click", user: "frank", ts: "Jan 7", color: "#4ade80" },
  { id: 8, event: "signup", user: "grace", ts: "Jan 8", color: "#4ade80" },
];

export const newBatchRows = [
  { id: 9, event: "purchase", user: "henry", ts: "Jan 9", color: "#fb923c" },
  { id: 10, event: "logout", user: "iris", ts: "Jan 10", color: "#fb923c" },
  { id: 11, event: "page_view", user: "jack", ts: "Jan 11", color: "#fb923c" },
];

export function Row({
  row,
  animate,
  delay = 0,
  dim = false,
}: {
  row: any;
  animate?: boolean;
  delay?: number;
  dim?: boolean;
}) {
  const [visible, setVisible] = useState(!animate);
  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    } else {
      setVisible(true);
    }
  }, [animate, delay]);
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        padding: "5px 10px",
        borderRadius: 6,
        background: visible
          ? dim
            ? "rgba(255,255,255,0.03)"
            : "rgba(255,255,255,0.06)"
          : "transparent",
        border: `1px solid ${visible ? (dim ? "rgba(255,255,255,0.06)" : row.color + "44") : "transparent"}`,
        transition: "all 0.4s ease",
        opacity: dim ? 0.35 : visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-12px)",
        marginBottom: 4,
      }}
    >
      {["id", "event", "user", "ts"].map((k) => (
        <span
          key={k}
          style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            color: k === "id" ? "#94a3b8" : k === "ts" ? row.color : "#e2e8f0",
            minWidth: k === "event" ? 70 : k === "user" ? 50 : 28,
          }}
        >
          {row[k]}
        </span>
      ))}
    </div>
  );
}

export function TableBox({
  title,
  rows,
  animate = false,
  highlightNew = false,
  processing = false,
  badge = null,
}: {
  title: string;
  rows: any[];
  animate?: boolean;
  highlightNew?: boolean;
  processing?: boolean;
  badge?: string | null;
}) {
  return (
    <div
      style={{
        background: "rgba(15, 23, 42, 0.8)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        padding: "14px 16px",
        minWidth: 240,
        position: "relative",
      }}
    >
      {badge && (
        <div
          style={{
            position: "absolute",
            top: -10,
            right: 10,
            background: badge === "NEW" ? "#fb923c" : "#4ade80",
            color: "#000",
            fontSize: 9,
            fontWeight: 800,
            padding: "2px 8px",
            borderRadius: 20,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: 1,
          }}
        >
          {badge}
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            background: processing ? "#fb923c" : "#4ade80",
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#94a3b8",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: 1,
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{ display: "flex", gap: 8, marginBottom: 6, padding: "0 10px" }}
      >
        {["id", "event", "user", "ts"].map((k) => (
          <span
            key={k}
            style={{
              fontSize: 9,
              color: "#475569",
              fontFamily: "'JetBrains Mono', monospace",
              minWidth: k === "event" ? 70 : k === "user" ? 50 : 28,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {k}
          </span>
        ))}
      </div>
      {rows.map((row, i) => (
        <Row
          key={row.id}
          row={row}
          animate={animate}
          delay={i * 80}
          dim={highlightNew && i < 5}
        />
      ))}
    </div>
  );
}

export function Arrow({
  label,
  color = "#4ade80",
  pulse = false,
}: {
  label?: string;
  color?: string;
  pulse?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: "0 8px",
      }}
    >
      {label && (
        <span
          style={{
            fontSize: 9,
            color: color,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: 0.5,
            textAlign: "center",
            maxWidth: 80,
          }}
        >
          {label}
        </span>
      )}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: 40,
            height: 2,
            background: color,
            animation: pulse ? "pulse 1.5s ease-in-out infinite" : "none",
            boxShadow: pulse ? `0 0 8px ${color}` : "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -6,
            top: -4,
            width: 0,
            height: 0,
            borderTop: "5px solid transparent",
            borderBottom: "5px solid transparent",
            borderLeft: `8px solid ${color}`,
          }}
        />
      </div>
    </div>
  );
}
