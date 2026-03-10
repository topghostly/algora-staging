import React, { useState } from "react";
import { T } from "./constants";
import {
  BeginnerNote,
  SectionTitle,
  CodeBlock,
  GenericCourse,
  InfoCard,
} from "./shared-ui";

export function EnvironmentSim() {
  const [env, setEnv] = useState("dev");

  const envConfig: Record<string, any> = {
    dev: {
      color: T.grey,
      label: "dev",
      icon: "🛠️",
      schema: "dbt_damilare",
      materialize: "view",
      limit: "LIMIT 500",
      freshness: "last 30 days only",
      buildTime: "~5s",
    },
    ci: {
      color: T.yellow,
      label: "ci",
      icon: "🧪",
      schema: "ci_pr_42",
      materialize: "view",
      limit: "LIMIT 500",
      freshness: "last 30 days only",
      buildTime: "~30s",
    },
    prod: {
      color: T.green,
      label: "prod",
      icon: "🚀",
      schema: "analytics",
      materialize: "table",
      limit: "",
      freshness: "full history",
      buildTime: "~8min",
    },
  };

  const ec = envConfig[env];

  const compiledSQL = `{{ config(
    materialized = '${ec.materialize}'
) }}

SELECT
  l.loan_id,
  l.amount,
  c.country_name,
  p.total_paid
FROM {{ ref('stg_loans') }} l
JOIN {{ ref('dim_customers') }} c
  ON l.customer_id = c.customer_id
JOIN {{ ref('int_payments') }} p
  ON l.loan_id = p.loan_id
${
  env !== "prod"
    ? `WHERE l.created_date >= DATEADD('day',-30,CURRENT_DATE())
${ec.limit}  -- dev/ci: small dataset`
    : "-- prod: full history, no limit"
}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        The same model behaves differently in each environment.{" "}
        <strong style={{ color: T.teal }}>
          Switch between dev, ci, and prod
        </strong>{" "}
        to see how the compiled SQL and materialization change — and why that
        matters.
      </BeginnerNote>

      {/* Environment tabs */}
      <div style={{ display: "flex", gap: 6 }}>
        {Object.entries(envConfig).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setEnv(key)}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              fontSize: 11,
              cursor: "pointer",
              flex: 1,
              fontFamily: "'JetBrains Mono',monospace",
              fontWeight: 700,
              transition: "all 0.2s",
              border: `1px solid ${env === key ? cfg.color : "rgba(255,255,255,0.08)"}`,
              background:
                env === key ? `${cfg.color}18` : "rgba(255,255,255,0.03)",
              color: env === key ? cfg.color : T.grey,
            }}
          >
            {cfg.icon} {cfg.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Compiled model */}
        <div>
          <SectionTitle color={ec.color}>COMPILED SQL in {env}</SectionTitle>
          <CodeBlock code={compiledSQL} small />
        </div>

        {/* Config */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SectionTitle color={ec.color}>ENVIRONMENT PROPERTIES</SectionTitle>
          {[
            ["Schema", ec.schema, "Where tables/views are created"],
            [
              "Materialisation",
              ec.materialize,
              env === "prod"
                ? "Table = fast queries"
                : "View = fast build times",
            ],
            [
              "Data range",
              ec.freshness,
              env === "prod"
                ? "Full history for accuracy"
                : "Limited for speed",
            ],
            ["Approx build time", ec.buildTime, ""],
          ].map(([label, value, note]) => (
            <div
              key={label}
              style={{
                background: `${ec.color}09`,
                border: `1px solid ${ec.color}22`,
                borderRadius: 8,
                padding: "8px 12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: note ? 3 : 0,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: T.grey,
                    fontFamily: "monospace",
                  }}
                >
                  {label}
                </span>
                <code
                  style={{
                    fontSize: 11,
                    color: ec.color,
                    fontFamily: "monospace",
                  }}
                >
                  {value}
                </code>
              </div>
              {note && (
                <div
                  style={{
                    fontSize: 10,
                    color: T.greyDark,
                    fontFamily: "monospace",
                  }}
                >
                  {note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* dbt_project.yml config */}
      <SectionTitle>HOW TO SET THIS IN dbt_project.yml</SectionTitle>
      <CodeBlock
        code={`models:
  lending_analytics:
    +materialized: >-
      {{ 'table' if target.name == 'prod' else 'view' }}

    marts:
      +meta:
        owner: "data-team@company.com"

# In profiles.yml — each env has its own target:
# dev  → schema: dbt_damilare
# ci   → schema: ci_pr_{{ env_var('PR_NUMBER') }}
# prod → schema: analytics`}
        small
      />
    </div>
  );
}

export function DeploymentSlides() {
  const steps = [
    {
      title: "The 3 Environments",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            Every dbt project needs at least three environments:{" "}
            <strong style={{ color: T.grey }}>dev</strong> where you build,{" "}
            <strong style={{ color: T.yellow }}>CI</strong> where automated
            tests run on each PR, and{" "}
            <strong style={{ color: T.green }}>prod</strong> where analysts
            actually query your data.
          </BeginnerNote>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            {[
              [
                "🛠️",
                "dev",
                T.grey,
                "Your personal sandbox. Fast iteration — use views and row limits. No one else reads from here.",
              ],
              [
                "🧪",
                "ci",
                T.yellow,
                "Temporary schema created per Pull Request. Runs dbt build automatically. Destroyed after PR merges.",
              ],
              [
                "🚀",
                "prod",
                T.green,
                "The real tables. Full data. Analysts, dashboards, and APIs read from here. Runs on a schedule.",
              ],
            ].map(([icon, name, c, desc]: any) => (
              <div
                key={name}
                style={{
                  background: `${c}09`,
                  border: `1px solid ${c}25`,
                  borderRadius: 10,
                  padding: "14px",
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                <code
                  style={{
                    fontSize: 13,
                    color: c,
                    fontFamily: "monospace",
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 700,
                  }}
                >
                  {name}
                </code>
                <div
                  style={{ fontSize: 11, color: T.greyLight, lineHeight: 1.6 }}
                >
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Interactive: Environment Switcher",
      content: () => <EnvironmentSim />,
    },
    {
      title: "CI & Deployment",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            <strong style={{ color: T.red }}>
              CI (Continuous Integration)
            </strong>{" "}
            means every PR automatically runs your dbt models and tests before
            code merges. It's your safety net.
          </BeginnerNote>
          <SectionTitle>CI JOB PATTERN</SectionTitle>
          <CodeBlock
            code={`# On every PR → CI job runs:

# 1. Use state management (Slim CI) — only rebuild changed models:
dbt build \\
  --select state:modified+ \\
  --defer \\
  --state ./prod-manifest/ \\
  --target ci

# 2. Tests run automatically as part of dbt build
# 3. If any test fails → PR is blocked
# 4. If all pass → PR can be reviewed and merged`}
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <InfoCard
              icon="⚡"
              title="Slim CI"
              body="Combine --select state:modified+ with --defer to only build changed models. Cuts CI from hours to minutes on large projects."
              color={T.red}
            />
            <InfoCard
              icon="🔀"
              title="PR environments"
              body="Each PR builds into its own schema (ci_pr_123). Tests run against isolated data — no risk of polluting production."
              color={T.red}
            />
          </div>
        </div>
      ),
    },
  ];
  return <GenericCourse steps={steps} color={T.red} />;
}
