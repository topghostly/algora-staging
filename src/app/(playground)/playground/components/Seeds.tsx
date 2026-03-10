import React, { useState } from "react";
import { T } from "./constants";
import {
  BeginnerNote,
  SectionTitle,
  CodeBlock,
  GenericCourse,
  Callout,
  InfoCard,
} from "./shared-ui";

export function SeedSimulator() {
  const [phase, setPhase] = useState(0);
  // 0=csv, 1=running, 2=loaded, 3=queried
  const [running, setRunning] = useState(false);

  const csvRows = [
    {
      country_code: "UG",
      country_name: "Uganda",
      currency: "UGX",
      region: "East Africa",
    },
    {
      country_code: "KE",
      country_name: "Kenya",
      currency: "KES",
      region: "East Africa",
    },
    {
      country_code: "GH",
      country_name: "Ghana",
      currency: "GHS",
      region: "West Africa",
    },
    {
      country_code: "NG",
      country_name: "Nigeria",
      currency: "NGN",
      region: "West Africa",
    },
    {
      country_code: "ZA",
      country_name: "South Africa",
      currency: "ZAR",
      region: "Southern Africa",
    },
  ];

  const resultRows = [
    {
      loan_id: "LN-001",
      amount: "$4,200",
      country_name: "Uganda",
      currency: "UGX",
      region: "East Africa",
    },
    {
      loan_id: "LN-002",
      amount: "$1,800",
      country_name: "Kenya",
      currency: "KES",
      region: "East Africa",
    },
    {
      loan_id: "LN-003",
      amount: "$6,500",
      country_name: "Nigeria",
      currency: "NGN",
      region: "West Africa",
    },
  ];

  const runSeed = () => {
    if (phase >= 2) {
      setPhase(0);
      return;
    }
    setRunning(true);
    setPhase(1);
    setTimeout(() => {
      setRunning(false);
      setPhase(2);
    }, 1800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        Watch how a CSV file becomes a real warehouse table that your models can
        query. Click <strong style={{ color: "#a3e635" }}>Run dbt seed</strong>{" "}
        to simulate the process, then see how a model joins against it.
      </BeginnerNote>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 10,
          alignItems: "flex-start",
        }}
      >
        {/* Left: CSV file */}
        <div>
          <SectionTitle>seeds/country_codes.csv</SectionTitle>
          <div
            style={{
              background: "rgba(4,9,20,0.95)",
              border: `1px solid ${phase >= 1 ? "#a3e635" + "55" : T.slate}`,
              borderRadius: 8,
              overflow: "hidden",
              transition: "border-color 0.4s",
            }}
          >
            <div
              style={{
                padding: "6px 10px",
                borderBottom: `1px solid ${T.slate}`,
                display: "flex",
                gap: 8,
              }}
            >
              {["country_code", "country_name", "currency", "region"].map(
                (h) => (
                  <span
                    key={h}
                    style={{
                      fontSize: 8,
                      fontFamily: "monospace",
                      color: T.greyDark,
                      flex: 1,
                    }}
                  >
                    {h}
                  </span>
                ),
              )}
            </div>
            {csvRows.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: "5px 10px",
                  borderBottom:
                    i < csvRows.length - 1 ? `1px solid ${T.slate}00` : "none",
                  display: "flex",
                  gap: 8,
                  background:
                    phase >= 1 ? `${"#a3e635"}0${i + 1}` : "transparent",
                  transition: `background 0.3s`,
                  transitionDelay: `${i * 120}ms`,
                }}
              >
                {[r.country_code, r.country_name, r.currency, r.region].map(
                  (v, j) => (
                    <span
                      key={j}
                      style={{
                        fontSize: 9,
                        fontFamily: "monospace",
                        color: phase >= 1 ? "#a3e635" : T.greyDark,
                        flex: 1,
                        transition: "color 0.3s",
                        transitionDelay: `${i * 120}ms`,
                      }}
                    >
                      {v}
                    </span>
                  ),
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <button
              onClick={runSeed}
              disabled={running}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 8,
                fontSize: 11,
                cursor: running ? "not-allowed" : "pointer",
                fontFamily: "'JetBrains Mono',monospace",
                fontWeight: 700,
                border: `1px solid ${"#a3e635"}55`,
                background:
                  phase >= 2 ? "rgba(163,230,53,0.06)" : `${"#a3e635"}18`,
                color: running ? T.grey : "#a3e635",
                transition: "all 0.2s",
              }}
            >
              {running
                ? "⚙️  Loading to warehouse..."
                : phase >= 2
                  ? "↩ Reset"
                  : "▶  Run dbt seed"}
            </button>
          </div>
        </div>

        {/* Middle arrow */}
        <div
          style={{
            paddingTop: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: phase >= 2 ? "#a3e635" : T.slate,
              fontFamily: "monospace",
              transition: "color 0.4s",
            }}
          >
            dbt seed
          </div>
          <div
            style={{
              fontSize: 16,
              color: phase >= 2 ? "#a3e635" : T.slate,
              transition: "color 0.4s",
            }}
          >
            →
          </div>
        </div>

        {/* Right: warehouse table */}
        <div>
          <SectionTitle>warehouse: reference.country_codes</SectionTitle>
          {phase < 2 ? (
            <div
              style={{
                background: "rgba(4,9,20,0.6)",
                border: `2px dashed ${T.slate}`,
                borderRadius: 8,
                padding: "20px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 6 }}>📭</div>
              <div
                style={{
                  fontSize: 10,
                  color: T.greyDark,
                  fontFamily: "monospace",
                }}
              >
                table does not exist yet
              </div>
            </div>
          ) : (
            <div
              style={{
                background: "rgba(4,9,20,0.95)",
                border: `1px solid ${"#a3e635"}44`,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "6px 10px",
                  borderBottom: `1px solid ${"#a3e635"}22`,
                  display: "flex",
                  gap: 8,
                  background: `${"#a3e635"}08`,
                }}
              >
                {["country_code", "country_name", "currency", "region"].map(
                  (h) => (
                    <span
                      key={h}
                      style={{
                        fontSize: 8,
                        fontFamily: "monospace",
                        color: "#a3e635",
                        flex: 1,
                      }}
                    >
                      {h}
                    </span>
                  ),
                )}
              </div>
              {csvRows.map((r, i) => (
                <div
                  key={i}
                  style={{
                    padding: "5px 10px",
                    borderBottom:
                      i < csvRows.length - 1
                        ? `1px solid ${T.slate}66`
                        : "none",
                    display: "flex",
                    gap: 8,
                    animation: "slideIn 0.3s ease both",
                    animationDelay: `${i * 80}ms`,
                  }}
                >
                  {[r.country_code, r.country_name, r.currency, r.region].map(
                    (v, j) => (
                      <span
                        key={j}
                        style={{
                          fontSize: 9,
                          fontFamily: "monospace",
                          color: T.greyLight,
                          flex: 1,
                        }}
                      >
                        {v}
                      </span>
                    ),
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Step 2: ref() in a model */}
      {phase >= 2 && (
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <SectionTitle color="#a3e635">NOW ref() IT IN A MODEL</SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <CodeBlock
              code={`-- models/marts/fct_disbursements.sql
SELECT
  l.loan_id,
  l.amount,
  c.country_name,  -- ← from seed!
  c.currency,
  c.region
FROM {{ ref('stg_loans') }} l
JOIN {{ ref('country_codes') }} c
  ON l.country_code = c.country_code`}
              small
            />
            <div
              style={{
                paddingTop: 36,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  color: "#a3e635",
                  fontFamily: "monospace",
                }}
              >
                dbt run
              </span>
              <span style={{ fontSize: 16, color: "#a3e635" }}>→</span>
            </div>
            <div>
              <div
                style={{
                  background: "rgba(4,9,20,0.95)",
                  border: `1px solid ${"#a3e635"}44`,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "6px 10px",
                    borderBottom: `1px solid ${"#a3e635"}22`,
                    display: "flex",
                    gap: 8,
                    background: `${"#a3e635"}08`,
                  }}
                >
                  {[
                    "loan_id",
                    "amount",
                    "country_name",
                    "currency",
                    "region",
                  ].map((h) => (
                    <span
                      key={h}
                      style={{
                        fontSize: 8,
                        fontFamily: "monospace",
                        color: "#a3e635",
                        flex: 1,
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                {resultRows.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "5px 10px",
                      borderBottom:
                        i < resultRows.length - 1
                          ? `1px solid ${T.slate}66`
                          : "none",
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    {[
                      r.loan_id,
                      r.amount,
                      r.country_name,
                      r.currency,
                      r.region,
                    ].map((v, j) => (
                      <span
                        key={j}
                        style={{
                          fontSize: 9,
                          fontFamily: "monospace",
                          color: T.greyLight,
                          flex: 1,
                        }}
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#a3e635",
                  fontFamily: "monospace",
                  marginTop: 5,
                }}
              >
                ✓ Seed data joined into mart
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SeedsSlides() {
  const steps = [
    {
      title: "Seeds — CSV as Tables",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            A <strong style={{ color: "#a3e635" }}>seed</strong> is just a CSV
            file that lives in your dbt project. When you run{" "}
            <code style={{ color: "#a3e635" }}>dbt seed</code>, dbt loads it
            into your warehouse as a table. It becomes a real warehouse table
            you can <code style={{ color: "#a3e635" }}>ref()</code> from any
            model.
          </BeginnerNote>
          <Callout icon="💡" title="WHEN TO USE SEEDS" color="#a3e635">
            Seeds are perfect for small, slowly-changing reference data: country
            codes, product categories, cost center mappings, risk tiers. If it
            fits in a spreadsheet and rarely changes — it's a seed candidate.
          </Callout>
          <CodeBlock
            code={`# Project structure:
seeds/
  country_codes.csv       ← you create this

# dbt_project.yml — configure the seed:
seeds:
  lending_analytics:
    country_codes:
      +schema: reference      # loads to reference.country_codes
      +column_types:
        country_code: varchar(2)
        currency: varchar(3)`}
          />
        </div>
      ),
    },
    {
      title: "Interactive: Seed → Table → Model",
      content: () => <SeedSimulator />,
    },
    {
      title: "Analyses — Ad Hoc SQL",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            Analyses are SQL files in the{" "}
            <code style={{ color: "#a3e635" }}>analyses/</code> folder. They use{" "}
            <code style={{ color: "#a3e635" }}>ref()</code> and Jinja — but dbt{" "}
            <strong style={{ color: "#f1f5f9" }}>
              never materialises them
            </strong>
            . They compile to plain SQL you run manually in your warehouse
            editor.
          </BeginnerNote>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <SectionTitle>analyses/monthly_collection_rate.sql</SectionTitle>
              <CodeBlock
                code={`-- Uses ref() — dbt tracks lineage
-- but NEVER creates a table from this

SELECT
    DATE_TRUNC('month', payment_date)
        AS payment_month,
    COUNT(DISTINCT loan_id)
        AS loans_with_payment,
    SUM(amount)         AS total_collected,
    AVG(days_to_repay)  AS avg_days_to_repay
FROM {{ ref('fct_repayments') }}
WHERE payment_status = 'completed'
GROUP BY 1 ORDER BY 1 DESC`}
                small
              />
            </div>
            <div>
              <SectionTitle>WORKFLOW</SectionTitle>
              <CodeBlock
                code={`# Compile: resolves ref() to real table names
dbt compile

# Output lands here:
# target/compiled/lending_analytics/
#   analyses/monthly_collection_rate.sql

# Copy that compiled SQL and run it
# in your warehouse SQL editor / BI tool`}
                small
              />
              <InfoCard
                icon="🎯"
                title="Good for analyses"
                body="Regulatory reports, audit queries, one-off stakeholder requests. Keeps ad hoc SQL in Git alongside your models."
                color="#a3e635"
              />
            </div>
          </div>
        </div>
      ),
    },
  ];
  return <GenericCourse steps={steps} color="#a3e635" />;
}
