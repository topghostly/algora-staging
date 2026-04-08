// ─── TOKENS ───────────────────────────────────────────────────────────────────

export const T = {
  bg: "#07090f",
  surface: "#0d1220",
  card: "#111827",
  raised: "#141d2e",
  slate: "#1e293b",
  slateLight: "#273548",
  greyDark: "#334155",
  grey: "#64748b",
  greyLight: "#94a3b8",
  white: "#f1f5f9",
  green: "#4ade80",
  yellow: "#facc15",
  orange: "#fb923c",
  red: "#f87171",
  blue: "#60a5fa",
  purple: "#c084fc",
  pink: "#f472b6",
  teal: "#2dd4bf",
  cyan: "#22d3ee",
  indigo: "#818cf8",
};

export const LEVEL_STYLE: Record<string, { label: string; bg: string; text: string }> = {
  easy: { label: "Beginner",     bg: "rgba(74,222,128,.1)",  text: T.green  },
  mid:  { label: "Intermediate", bg: "rgba(250,204,21,.1)",  text: T.yellow },
  hard: { label: "Advanced",     bg: "rgba(248,113,113,.1)", text: T.red    },
};
