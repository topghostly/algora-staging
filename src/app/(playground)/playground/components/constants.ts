import { Course, DesignTokens } from "./types";

export const T: DesignTokens = {
  teal: "#2dd4bf",
  tealDim: "#0d9488",
  tealBg: "rgba(45,212,191,0.08)",
  tealBorder: "rgba(45,212,191,0.22)",
  grey: "#64748b",
  greyLight: "#94a3b8",
  greyDark: "#334155",
  greyBg: "rgba(100,116,139,0.08)",
  slate: "#1e293b",
  ink: "#060b18",
  surface: "rgba(12,18,36,0.85)",
  orange: "#fb923c",
  purple: "#818cf8",
  green: "#4ade80",
  red: "#f87171",
  yellow: "#facc15",
  blue: "#38bdf8",
  pink: "#f472b6",
};

export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=JetBrains+Mono:wght@400;600;700&family=Onest:wght@400;500;600&display=swap');
  @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 6px currentColor}50%{opacity:.5;box-shadow:none} }
  @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn { from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)} }
  @keyframes popIn { from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)} }
  @keyframes flow { 0%{stroke-dashoffset:100}100%{stroke-dashoffset:0} }
  * { box-sizing:border-box; }
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}
`;

export const DIFF_COLOR: Record<string, string> = {
  Beginner: T.green,
  Intermediate: T.orange,
  Advanced: T.red,
};
