import React, { useState } from "react";
import { T } from "../../components/constants";
import {
  BeginnerNote,
  SectionTitle,
  CodeBlock,
  GenericCourse,
} from "../../components/shared-ui";

export function GrantsMatrix() {
  const roles = [
    "ROLE_ANALYST",
    "ROLE_FINANCE",
    "ROLE_CREDIT_RISK",
    "ROLE_EXEC",
    "ROLE_AUDIT",
  ];
  const models = [
    {
      id: "stg_loans",
      label: "stg_loans",
      layer: "staging",
      defaultGrants: [],
    },
    {
      id: "dim_customers",
      label: "dim_customers",
      layer: "mart",
      defaultGrants: [
        "ROLE_ANALYST",
        "ROLE_FINANCE",
        "ROLE_CREDIT_RISK",
        "ROLE_EXEC",
      ],
    },
    {
      id: "fct_loans",
      label: "fct_disbursements",
      layer: "mart",
      defaultGrants: ["ROLE_ANALYST", "ROLE_FINANCE", "ROLE_EXEC"],
    },
    {
      id: "fct_credit",
      label: "fct_defaults",
      layer: "mart",
      defaultGrants: ["ROLE_CREDIT_RISK", "ROLE_EXEC"],
    },
    {
      id: "rpt_audit",
      label: "rpt_audit_trail",
      layer: "mart",
      defaultGrants: ["ROLE_AUDIT", "ROLE_EXEC"],
    },
  ];

  const [grants, setGrants] = useState<Record<string, Set<string>>>(() => {
    const g: Record<string, Set<string>> = {};
    models.forEach((m) => {
      g[m.id] = new Set(m.defaultGrants);
    });
    return g;
  });
  const [rebuilt, setRebuilt] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);
  const [showGrantSql, setShowGrantSql] = useState(false);

  const toggle = (modelId: string, role: string) => {
    setGrants((prev) => {
      const next = { ...prev, [modelId]: new Set(prev[modelId]) };
      next[modelId].has(role)
        ? next[modelId].delete(role)
        : next[modelId].add(role);
      return next;
    });
    setRebuilt(false);
  };

  const rebuild = () => {
    setRebuilding(true);
    setTimeout(() => {
      setRebuilding(false);
      setRebuilt(true);
      setShowGrantSql(true);
    }, 1200);
  };

  const grantStatements = models
    .filter((m) => grants[m.id].size > 0)
    .map(
      (m) => `GRANT SELECT ON TABLE analytics.${m.label}
  TO ROLE ${[...grants[m.id]].join(", ")};`,
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        <strong style={{ color: "#86efac" }}>Click the checkboxes</strong> to
        grant or revoke access for each role on each model. Then click{" "}
        <strong style={{ color: "#86efac" }}>Run dbt build</strong> to see the
        GRANT statements dbt automatically executes after building each table.
      </BeginnerNote>

      {/* Matrix */}
      <div
        style={{
          background: "rgba(4,9,20,0.9)",
          border: `1px solid ${T.slate}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.slate}` }}>
                <th
                  style={{
                    padding: "8px 12px",
                    textAlign: "left",
                    fontSize: 9,
                    color: T.greyDark,
                    fontFamily: "monospace",
                    letterSpacing: 0.5,
                    fontWeight: 600,
                  }}
                >
                  MODEL
                </th>
                {roles.map((r) => (
                  <th
                    key={r}
                    style={{
                      padding: "8px 10px",
                      fontSize: 8,
                      color: "#86efac",
                      fontFamily: "monospace",
                      whiteSpace: "nowrap",
                      fontWeight: 600,
                    }}
                  >
                    {r.replace("ROLE_", "")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {models.map((m, mi) => (
                <tr
                  key={m.id}
                  style={{
                    borderBottom:
                      mi < models.length - 1
                        ? `1px solid ${T.slate}44`
                        : "none",
                  }}
                >
                  <td style={{ padding: "8px 12px" }}>
                    <div
                      style={{
                        fontSize: 10,
                        fontFamily: "'JetBrains Mono',monospace",
                        color: T.greyLight,
                      }}
                    >
                      {m.label}
                    </div>
                    <div
                      style={{
                        fontSize: 8,
                        color: T.greyDark,
                        fontFamily: "monospace",
                      }}
                    >
                      {m.layer}
                    </div>
                  </td>
                  {roles.map((r) => {
                    const granted = grants[m.id]?.has(r);
                    return (
                      <td
                        key={r}
                        style={{ padding: "8px 10px", textAlign: "center" }}
                      >
                        <div
                          onClick={() => toggle(m.id, r)}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 5,
                            cursor: "pointer",
                            margin: "0 auto",
                            border: `1px solid ${granted ? "#86efac55" : "rgba(255,255,255,0.1)"}`,
                            background: granted
                              ? "rgba(134,239,172,0.15)"
                              : "rgba(255,255,255,0.03)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.18s",
                            fontSize: 11,
                          }}
                        >
                          {granted && (
                            <span style={{ color: "#86efac" }}>✓</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={rebuild}
        disabled={rebuilding}
        style={{
          padding: "8px 20px",
          borderRadius: 8,
          fontSize: 11,
          cursor: rebuilding ? "not-allowed" : "pointer",
          alignSelf: "flex-start",
          fontFamily: "'JetBrains Mono',monospace",
          fontWeight: 700,
          transition: "all 0.2s",
          border: `1px solid ${"#86efac"}55`,
          background: rebuilding ? `${"#86efac"}08` : `${"#86efac"}18`,
          color: rebuilding ? T.grey : "#86efac",
        }}
      >
        {rebuilding ? "⚙️  Building and granting..." : "▶  Run dbt build"}
      </button>

      {/* Generated GRANT SQL */}
      {showGrantSql && !rebuilding && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <SectionTitle color="#86efac">
            GRANT STATEMENTS dbt EXECUTES AUTOMATICALLY
          </SectionTitle>
          <CodeBlock
            code={grantStatements.join("\n\n") || "-- No grants configured"}
            small
          />
          <div
            style={{
              marginTop: 8,
              fontSize: 11,
              color: T.greyLight,
              lineHeight: 1.6,
            }}
          >
            ✅{" "}
            <strong style={{ color: "#86efac" }}>
              These run after every dbt build
            </strong>{" "}
            — even if the table is rebuilt from scratch. No manual SQL required.
            Revoked roles are automatically removed.
          </div>
        </div>
      )}
    </div>
  );
}

export function GrantsSlides() {
  const steps = [
    {
      title: "dbt Grants",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            When dbt builds a table, it's private by default — only the service
            account that ran dbt can read it.{" "}
            <strong style={{ color: "#86efac" }}>dbt grants</strong>{" "}
            automatically run{" "}
            <code style={{ color: "#86efac" }}>GRANT SELECT</code> on your
            behalf after every build, so the right roles always have access.
          </BeginnerNote>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <SectionTitle color={T.red}>
                WITHOUT GRANTS — brittle
              </SectionTitle>
              <CodeBlock
                code={`-- After EVERY dbt build, manually run:
GRANT SELECT ON TABLE analytics.fct_disbursements
  TO ROLE ROLE_ANALYST;

-- When dbt rebuilds the table:
-- Grant is WIPED. Access breaks.
-- Analyst gets "Permission denied" ❌
-- You scramble to fix it at 9pm 😰`}
                small
              />
            </div>
            <div>
              <SectionTitle color="#86efac">
                WITH GRANTS — automatic
              </SectionTitle>
              <CodeBlock
                code={`-- models/marts/fct_disbursements.sql
{{ config(
  materialized='table',
  grants={
    'select': [
      'ROLE_ANALYST',
      'ROLE_FINANCE',
      'ROLE_EXEC'
    ]
  }
) }}
-- dbt grants access after every build ✓`}
                small
              />
            </div>
          </div>
          <SectionTitle>PROJECT-WIDE GRANTS IN dbt_project.yml</SectionTitle>
          <CodeBlock
            code={`models:
  lending_analytics:
    +grants:
      select: ['ROLE_ANALYST']    # every model
    marts:
      +grants:
        select: ['ROLE_ANALYST','ROLE_FINANCE']
    marts/credit:
      +grants:
        select: ['ROLE_CREDIT_RISK']  # restricted`}
            small
          />
        </div>
      ),
    },
    {
      title: "Interactive: Permission Matrix",
      content: () => <GrantsMatrix />,
    },
  ];
  return <GenericCourse steps={steps} color="#86efac" />;
}
