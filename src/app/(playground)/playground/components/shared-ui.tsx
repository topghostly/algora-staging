import React from "react";
import { T } from "./constants";

export interface CodeBlockProps {
  code: string;
  small?: boolean;
}

export function CodeBlock({ code, small = false }: CodeBlockProps) {
  return (
    <div
      style={{
        background: "rgba(4,9,20,0.97)",
        borderRadius: 8,
        padding: small ? "8px 12px" : "12px 16px",
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: small ? 10 : 11,
        lineHeight: 1.8,
        overflowX: "auto",
        border: `1px solid ${T.slate}`,
      }}
    >
      {code.split("\n").map((line, i) => {
        const isComment =
          line.trim().startsWith("--") ||
          line.trim().startsWith("#") ||
          line.trim().startsWith("//");
        const isJinja = line.includes("{{") || line.includes("{%");
        return (
          <div
            key={i}
            style={{
              color: isComment ? T.greyDark : isJinja ? T.orange : "#e2e8f0",
              whiteSpace: "pre",
            }}
          >
            {line || " "}
          </div>
        );
      })}
    </div>
  );
}

export interface TagProps {
  label: string | undefined;
  color: string | undefined;
}

export function Tag({ label, color }: TagProps) {
  return (
    <span
      style={{
        fontSize: 9,
        fontFamily: "'JetBrains Mono',monospace",
        padding: "2px 7px",
        borderRadius: 10,
        background: color + "18",
        border: `1px solid ${color}44`,
        color,
      }}
    >
      {label}
    </span>
  );
}

export function SectionTitle({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      style={{
        fontSize: 9,
        color: color || T.greyDark,
        fontFamily: "'JetBrains Mono',monospace",
        letterSpacing: 1.5,
        textTransform: "uppercase",
        marginBottom: 6,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span
        style={{
          width: 16,
          height: 1,
          background: color || T.greyDark,
          display: "inline-block",
        }}
      />
      {children}
    </div>
  );
}

export function InfoCard({
  icon,
  title,
  body,
  color = T.green,
}: {
  icon: string;
  title: string;
  body: string;
  color?: string;
}) {
  return (
    <div
      style={{
        background: `${color}09`,
        border: `1px solid ${color}28`,
        borderRadius: 10,
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color,
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ fontSize: 12, color: T.greyLight, lineHeight: 1.65 }}>
        {body}
      </div>
    </div>
  );
}

export function BeginnerNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        background: T.tealBg,
        border: T.tealBorder,
        borderRadius: 10,
        padding: "10px 14px",
      }}
    >
      <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
      <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.65 }}>
        {children}
      </div>
    </div>
  );
}

export function Callout({
  icon = "⚠️",
  title,
  children,
  color = T.orange,
}: {
  icon?: string;
  title?: string;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        background: `${color}09`,
        border: `1px solid ${color}30`,
        borderRadius: 10,
        padding: "10px 14px",
      }}
    >
      <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
      <div>
        {title && (
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color,
              fontFamily: "monospace",
              marginBottom: 4,
              letterSpacing: 0.5,
            }}
          >
            {title}
          </div>
        )}
        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.65 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function GenericCourse({
  steps,
  color,
}: {
  steps: any[];
  color: string;
}) {
  const [idx, setIdx] = React.useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {steps.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: 5,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                padding: "5px 13px",
                borderRadius: 20,
                fontSize: 10,
                cursor: "pointer",
                fontFamily: "'JetBrains Mono',monospace",
                transition: "all 0.18s",
                border: `1px solid ${idx === i ? color : "rgba(255,255,255,0.08)"}`,
                background: idx === i ? `${color}18` : "transparent",
                color: idx === i ? color : T.grey,
              }}
            >
              {i + 1}. {s.title}
            </button>
          ))}
        </div>
      )}
      <div>{steps[idx].content()}</div>
    </div>
  );
}
