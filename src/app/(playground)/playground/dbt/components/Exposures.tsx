import React, { useState } from "react";
import { T } from "../../components/constants";
import {
  BeginnerNote,
  SectionTitle,
  CodeBlock,
  GenericCourse,
  InfoCard,
} from "../../components/shared-ui";

export function ExposureLineageViz() {
  const [activeExposure, setActiveExposure] = useState<string | null>(null);
  const [broken, setBroken] = useState<string | null>(null);

  const nodes = [
    {
      id: "raw_loans",
      label: "raw.loans",
      layer: "source",
      x: 0,
      color: T.grey,
    },
    {
      id: "raw_payments",
      label: "raw.payments",
      layer: "source",
      x: 0,
      color: T.grey,
    },
    {
      id: "stg_loans",
      label: "stg_loans",
      layer: "staging",
      x: 1,
      color: T.purple,
    },
    {
      id: "stg_payments",
      label: "stg_payments",
      layer: "staging",
      x: 1,
      color: T.purple,
    },
    {
      id: "fct_loans",
      label: "fct_disbursements",
      layer: "mart",
      x: 2,
      color: T.orange,
    },
    {
      id: "fct_payments",
      label: "fct_repayments",
      layer: "mart",
      x: 2,
      color: T.orange,
    },
  ];

  const exposures = [
    {
      id: "dashboard",
      label: "Portfolio Dashboard",
      icon: "📊",
      color: T.blue,
      deps: ["fct_loans", "fct_payments"],
      type: "dashboard",
    },
    {
      id: "ml",
      label: "Risk ML Model",
      icon: "🤖",
      color: T.pink,
      deps: ["fct_loans"],
      type: "ml_model",
    },
    {
      id: "api",
      label: "Customer API",
      icon: "🔌",
      color: T.orange,
      deps: ["fct_loans"],
      type: "application",
    },
  ];

  const edges = [
    ["raw_loans", "stg_loans"],
    ["raw_payments", "stg_payments"],
    ["stg_loans", "fct_loans"],
    ["stg_payments", "fct_payments"],
    ["stg_loans", "fct_payments"],
  ];

  const affectedExposures = broken
    ? exposures.filter((e) => {
        // upstream of broken? check if broken feeds into any of e's deps
        const brokenFeeds = (modelId: string): boolean => {
          if (modelId === broken) return true;
          const upstream = edges
            .filter(([, t]) => t === modelId)
            .map(([s]) => s);
          return upstream.some((u) => brokenFeeds(u));
        };
        return e.deps.some((d) => brokenFeeds(d));
      })
    : [];

  const isNodeAffected = (id: string): boolean => {
    if (!broken) return false;
    const feeds = (nId: string): boolean => {
      if (nId === broken) return true;
      return edges
        .filter(([, t]) => t === nId)
        .map(([s]) => s)
        .some((u) => feeds(u));
    };
    return feeds(id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        Without exposures, dbt doesn't know who uses your data.{" "}
        <strong style={{ color: T.blue }}>Click an exposure</strong> to
        highlight what it depends on. Then{" "}
        <strong style={{ color: T.red }}>click "Break a model"</strong> to
        simulate a failure and see which exposures are at risk — this is why
        exposures exist.
      </BeginnerNote>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 10, color: T.grey, fontFamily: "monospace" }}>
          Click an exposure:
        </span>
        {exposures.map((e) => (
          <button
            key={e.id}
            onClick={() => {
              setActiveExposure(activeExposure === e.id ? null : e.id);
              setBroken(null);
            }}
            style={{
              padding: "5px 11px",
              borderRadius: 20,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              transition: "all 0.18s",
              border: `1px solid ${activeExposure === e.id ? e.color : "rgba(255,255,255,0.08)"}`,
              background:
                activeExposure === e.id ? `${e.color}18` : "transparent",
              color: activeExposure === e.id ? e.color : T.grey,
            }}
          >
            {e.icon} {e.label}
          </button>
        ))}
        <div style={{ width: 1, height: 16, background: T.slate }} />
        <span style={{ fontSize: 10, color: T.grey, fontFamily: "monospace" }}>
          Simulate break:
        </span>
        {[
          { id: "fct_loans", label: "fct_disbursements" },
          { id: "stg_payments", label: "stg_payments" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => {
              setBroken(broken === id ? null : id);
              setActiveExposure(null);
            }}
            style={{
              padding: "5px 11px",
              borderRadius: 20,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              transition: "all 0.18s",
              border: `1px solid ${broken === id ? T.red : "rgba(255,255,255,0.08)"}`,
              background:
                broken === id ? "rgba(248,113,113,0.12)" : "transparent",
              color: broken === id ? T.red : T.grey,
            }}
          >
            💥 {label}
          </button>
        ))}
        {(activeExposure || broken) && (
          <button
            onClick={() => {
              setActiveExposure(null);
              setBroken(null);
            }}
            style={{
              padding: "5px 11px",
              borderRadius: 20,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              border: `1px solid ${T.slate}`,
              background: "transparent",
              color: T.grey,
            }}
          >
            ↩ Reset
          </button>
        )}
      </div>

      {/* DAG */}
      <div
        style={{
          background: "rgba(4,9,20,0.9)",
          border: `1px solid ${T.slate}`,
          borderRadius: 12,
          padding: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 0,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {/* Sources */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
              minWidth: 110,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: T.greyDark,
                fontFamily: "monospace",
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              SOURCES
            </div>
            {nodes
              .filter((n) => n.layer === "source")
              .map((n) => {
                const highlight = activeExposure
                  ? exposures
                      .find((e) => e.id === activeExposure)
                      ?.deps.some((d) =>
                        edges.some(
                          ([s, t]) =>
                            s === n.id &&
                            (t === d || nodes.some((x) => x.id === t)),
                        ),
                      )
                  : false;
                const affected = isNodeAffected(n.id);
                const isBroken = broken === n.id;
                return (
                  <div
                    key={n.id}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 7,
                      fontSize: 9,
                      fontFamily: "'JetBrains Mono',monospace",
                      border: `1px solid ${isBroken ? T.red : affected ? "rgba(248,113,113,0.4)" : highlight ? n.color + "55" : "rgba(255,255,255,0.07)"}`,
                      background: isBroken
                        ? "rgba(248,113,113,0.12)"
                        : affected
                          ? "rgba(248,113,113,0.06)"
                          : highlight
                            ? `${n.color}12`
                            : "rgba(255,255,255,0.03)",
                      color: isBroken
                        ? T.red
                        : affected
                          ? T.red
                          : highlight
                            ? n.color
                            : T.greyDark,
                      transition: "all 0.25s",
                      width: 100,
                      textAlign: "center",
                    }}
                  >
                    {n.label}
                  </div>
                );
              })}
          </div>
          <div
            style={{ display: "flex", alignItems: "center", paddingTop: 28 }}
          >
            <div style={{ width: 14, height: 1, background: T.slate }} />
          </div>
          {/* Staging */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
              minWidth: 110,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: T.greyDark,
                fontFamily: "monospace",
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              STAGING
            </div>
            {nodes
              .filter((n) => n.layer === "staging")
              .map((n) => {
                const affected = isNodeAffected(n.id);
                const isBroken = broken === n.id;
                const activeExp = activeExposure
                  ? exposures.find((e) => e.id === activeExposure)
                  : null;
                const highlight = activeExp
                  ? edges.some(
                      ([s, t]) => s === n.id && activeExp.deps.includes(t),
                    ) || activeExp.deps.includes(n.id)
                  : false;
                return (
                  <div
                    key={n.id}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 7,
                      fontSize: 9,
                      fontFamily: "'JetBrains Mono',monospace",
                      border: `1px solid ${isBroken ? T.red : affected ? "rgba(248,113,113,0.4)" : highlight ? n.color + "55" : "rgba(255,255,255,0.07)"}`,
                      background: isBroken
                        ? "rgba(248,113,113,0.12)"
                        : affected
                          ? "rgba(248,113,113,0.06)"
                          : highlight
                            ? `${n.color}12`
                            : "rgba(255,255,255,0.03)",
                      color: isBroken
                        ? T.red
                        : affected
                          ? T.red
                          : highlight
                            ? n.color
                            : T.greyDark,
                      transition: "all 0.25s",
                      width: 100,
                      textAlign: "center",
                    }}
                  >
                    {n.label}
                  </div>
                );
              })}
          </div>
          <div
            style={{ display: "flex", alignItems: "center", paddingTop: 28 }}
          >
            <div style={{ width: 14, height: 1, background: T.slate }} />
          </div>
          {/* Marts */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
              minWidth: 120,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: T.greyDark,
                fontFamily: "monospace",
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              MARTS
            </div>
            {nodes
              .filter((n) => n.layer === "mart")
              .map((n) => {
                const isHighlighted = activeExposure
                  ? exposures
                      .find((e) => e.id === activeExposure)
                      ?.deps.includes(n.id)
                  : false;
                const affected = isNodeAffected(n.id);
                const isBroken = broken === n.id;
                return (
                  <div
                    key={n.id}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 7,
                      fontSize: 9,
                      fontFamily: "'JetBrains Mono',monospace",
                      border: `1px solid ${isBroken ? T.red : affected ? "rgba(248,113,113,0.4)" : isHighlighted ? n.color + "66" : "rgba(255,255,255,0.07)"}`,
                      background: isBroken
                        ? "rgba(248,113,113,0.12)"
                        : affected
                          ? "rgba(248,113,113,0.06)"
                          : isHighlighted
                            ? `${n.color}15`
                            : "rgba(255,255,255,0.03)",
                      color: isBroken
                        ? T.red
                        : affected
                          ? T.red
                          : isHighlighted
                            ? n.color
                            : T.greyDark,
                      transition: "all 0.25s",
                      width: 110,
                      textAlign: "center",
                      fontWeight: isHighlighted ? 700 : 400,
                    }}
                  >
                    {n.label}
                  </div>
                );
              })}
          </div>
          <div
            style={{ display: "flex", alignItems: "center", paddingTop: 28 }}
          >
            <div style={{ width: 14, height: 1, background: T.slate }} />
          </div>
          {/* Exposures */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
              minWidth: 130,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: T.greyDark,
                fontFamily: "monospace",
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              EXPOSURES
            </div>
            {exposures.map((e) => {
              const isActive = activeExposure === e.id;
              const isAffected =
                broken && affectedExposures.some((ae) => ae.id === e.id);
              return (
                <div
                  key={e.id}
                  onClick={() => {
                    setActiveExposure(isActive ? null : e.id);
                    setBroken(null);
                  }}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 7,
                    fontSize: 9,
                    fontFamily: "'JetBrains Mono',monospace",
                    border: `1px solid ${isAffected ? T.red + "66" : isActive ? e.color + "66" : "rgba(255,255,255,0.07)"}`,
                    background: isAffected
                      ? "rgba(248,113,113,0.1)"
                      : isActive
                        ? `${e.color}15`
                        : "rgba(255,255,255,0.03)",
                    color: isAffected ? T.red : isActive ? e.color : T.greyDark,
                    transition: "all 0.25s",
                    cursor: "pointer",
                    width: 120,
                    textAlign: "center",
                    fontWeight: isActive || isAffected ? 700 : 400,
                  }}
                >
                  {e.icon} {e.label}
                  {isAffected && (
                    <div style={{ fontSize: 8, color: T.red, marginTop: 2 }}>
                      ⚠️ AT RISK
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result message */}
      {broken && (
        <div
          style={{
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.25)",
            borderRadius: 10,
            padding: "12px 14px",
            animation: "popIn 0.2s ease",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: T.red,
              fontFamily: "monospace",
              marginBottom: 4,
            }}
          >
            💥 {nodes.find((n) => n.id === broken)?.label || broken} is broken
          </div>
          <div style={{ fontSize: 12, color: T.greyLight, lineHeight: 1.6 }}>
            {affectedExposures.length > 0 ? (
              <>
                Exposures at risk:{" "}
                <strong style={{ color: T.red }}>
                  {affectedExposures.map((e) => e.label).join(", ")}
                </strong>
                . Without exposures in your YAML, you'd have no idea these were
                broken until users complained.
              </>
            ) : (
              "No exposures depend on this model — safe to change."
            )}
          </div>
        </div>
      )}
      {activeExposure && (
        <div
          style={{
            background: `${exposures.find((e) => e.id === activeExposure)?.color}09`,
            border: `1px solid ${exposures.find((e) => e.id === activeExposure)?.color}25`,
            borderRadius: 10,
            padding: "12px 14px",
            animation: "popIn 0.2s ease",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: exposures.find((e) => e.id === activeExposure)?.color,
              fontFamily: "monospace",
              marginBottom: 4,
            }}
          >
            {exposures.find((e) => e.id === activeExposure)?.icon}{" "}
            {exposures.find((e) => e.id === activeExposure)?.label}
          </div>
          <div style={{ fontSize: 12, color: T.greyLight, lineHeight: 1.6 }}>
            Depends on:{" "}
            <strong style={{ color: "#f1f5f9" }}>
              {exposures
                .find((e) => e.id === activeExposure)
                ?.deps.map(
                  (depId) => nodes.find((n) => n.id === depId)?.label || depId,
                )
                .join(", ")}
            </strong>
            . If either of those models breaks or goes stale, dbt can alert the
            exposure owner before users notice.
          </div>
        </div>
      )}
    </div>
  );
}

export function ExposuresSlides() {
  const steps = [
    {
      title: "What are Exposures?",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            You've built{" "}
            <code style={{ color: T.blue }}>fct_disbursements</code> and it
            feeds a Looker dashboard, a risk ML model, and a customer-facing
            API. Without exposures, dbt has no idea about any of these.{" "}
            <strong style={{ color: T.blue }}>
              With exposures, they appear in your DAG
            </strong>{" "}
            — so when a model breaks, you know exactly what downstream tools are
            at risk.
          </BeginnerNote>
          <SectionTitle>DECLARING AN EXPOSURE</SectionTitle>
          <CodeBlock
            code={`# models/exposures.yml
version: 2
exposures:

  - name: loan_portfolio_dashboard
    label: "Loan Portfolio Dashboard"
    type: dashboard          # dashboard | notebook | ml_model | application
    maturity: high           # low | medium | high (SLA signal)
    url: https://bi.company.com/dashboards/42
    description: >
      Executive dashboard for loan portfolio health.
      Updated daily. Finance team relies on this for month-end.

    depends_on:
      - ref('fct_disbursements')   # ← these are your dbt models
      - ref('fct_repayments')

    owner:
      name: Damilare Adewale
      email: damilare@company.com`}
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <InfoCard
              icon="🗺️"
              title="Lineage visibility"
              body="Exposures appear as terminal nodes in dbt's DAG. Trace any dashboard back through every model to its raw source table."
              color={T.blue}
            />
            <InfoCard
              icon="🔔"
              title="Freshness alerts"
              body="Source freshness warnings propagate to exposures. Know which dashboards are at risk before your users notice stale data."
              color={T.blue}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Interactive: Lineage & Break Simulation",
      content: () => <ExposureLineageViz />,
    },
    {
      title: "Exposure Commands",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionTitle>SELECT MODELS FEEDING AN EXPOSURE</SectionTitle>
          <CodeBlock
            code={`# Run only models this exposure depends on:
dbt run  --select +exposure:loan_portfolio_dashboard

# Test all models feeding this exposure:
dbt test --select +exposure:loan_portfolio_dashboard

# Check freshness for its sources:
dbt source freshness \\
  --select +exposure:loan_portfolio_dashboard`}
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <InfoCard
              icon="👤"
              title="Owner accountability"
              body="When a model upstream of an exposure changes, you know exactly who to notify. The owner field is the point of contact."
              color={T.blue}
            />
            <InfoCard
              icon="📐"
              title="Maturity signals"
              body="low/medium/high maturity communicates SLA expectations. A 'high' maturity exposure means consumers depend on it for critical decisions."
              color={T.blue}
            />
          </div>
        </div>
      ),
    },
  ];
  return <GenericCourse steps={steps} color={T.blue} />;
}
