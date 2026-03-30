// ─── TOKENS & STYLES ──────────────────────────────────────────────────────────

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

export const PLAT = {
  mysql: { id: "mysql", label: "MySQL", icon: "🐬", color: "#f59e0b", border: "rgba(245,158,11,0.3)", bg: "rgba(245,158,11,0.07)" },
  postgres: { id: "postgres", label: "PostgreSQL", icon: "🐘", color: "#3b82f6", border: "rgba(59,130,246,0.3)", bg: "rgba(59,130,246,0.07)" },
  sqlserver: { id: "sqlserver", label: "SQL Server", icon: "🪟", color: "#e84c3d", border: "rgba(232,76,61,0.3)", bg: "rgba(232,76,61,0.07)" },
};

export const GS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#07090f;color:#f1f5f9;font-family:'DM Sans',sans-serif;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
@keyframes popIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes rowFlash{0%{background:rgba(250,204,21,.25)}100%{background:transparent}}
@keyframes rowAppear{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
@keyframes collapse{from{max-height:300px}to{max-height:36px}}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}
`;
