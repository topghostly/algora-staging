import React, { useState } from "react";
import { T } from "../../components/constants";
import {
  CodeBlock,
  SectionTitle,
  InfoCard,
  BeginnerNote,
  Callout,
  GenericCourse,
} from "../../components/shared-ui";

function LayerDAG() {
  const [active, setActive] = useState<string | null>(null);

  const layers = [
    {
      id: "source",
      label: "Source",
      sublabel: "Raw warehouse tables",
      icon: "🗄️",
      color: "#475569",
      x: 0,
      tables: ["raw.loans", "raw.customers", "raw.payments"],
      what: "These are the raw tables that already exist in your data warehouse — loaded by your data pipelines (Fivetran, Airbyte, custom ETL). You didn't create them. dbt reads from them.",
      example: `-- You DON'T create these. They already exist.
-- In your warehouse:
RAW.CORE_BANKING.LOANS
RAW.CORE_BANKING.CUSTOMERS
RAW.STRIPE.PAYMENTS`,
      rule: "Never modify source tables from dbt. Read-only.",
    },
    {
      id: "staging",
      label: "Staging",
      sublabel: "stg_ models",
      icon: "🔵",
      color: "#818cf8",
      x: 1,
      tables: ["stg_loans", "stg_customers", "stg_payments"],
      what: "Staging models are a thin cleaning layer — one per source table. They rename confusing column names, cast data types, and add basic derivations. Nothing complex.",
      example: `-- models/staging/core_banking/stg_loans.sql
SELECT
    loan_id,
    cust_id          AS customer_id,   -- rename
    loan_amt / 100   AS loan_amount,   -- cast cents→dollars
    created_ts::date AS created_date,  -- cast timestamp→date
    loan_status      AS status
FROM {{ source('core_banking', 'loans') }}`,
      rule: "One staging model per source table. No joins. No business logic.",
    },
    {
      id: "intermediate",
      label: "Intermediate",
      sublabel: "int_ models",
      icon: "🟡",
      color: "#facc15",
      x: 2,
      tables: ["int_payments_pivoted", "int_loan_metrics"],
      what: "Intermediate models handle complex transformations that are too long for a mart. They join and pivot staging data, but aren't consumed by BI tools directly. Think of them as building blocks.",
      example: `-- models/intermediate/int_payments_pivoted.sql
-- Pivot payment methods into columns per loan
SELECT
    loan_id,
    SUM(CASE WHEN method='mpesa'  THEN amount END) AS mpesa_total,
    SUM(CASE WHEN method='bank'   THEN amount END) AS bank_total,
    SUM(CASE WHEN method='cash'   THEN amount END) AS cash_total
FROM {{ ref('stg_payments') }}
GROUP BY loan_id`,
      rule: "Only used by other dbt models, never queried by analysts directly.",
    },
    {
      id: "mart",
      label: "Mart",
      sublabel: "fct_ / dim_ models",
      icon: "🟠",
      color: "#fb923c",
      x: 3,
      tables: ["fct_disbursements", "dim_customers", "fct_repayments"],
      what: "Marts are your final, polished tables. BI tools, dashboards, and analysts query these. They combine multiple staging and intermediate models into clean business facts and dimensions.",
      example: `-- models/marts/finance/fct_disbursements.sql
SELECT
    l.loan_id,
    l.loan_amount,
    l.created_date,
    c.customer_name,
    c.country_code,
    p.mpesa_total,
    p.bank_total
FROM {{ ref('stg_loans') }}         l
JOIN {{ ref('stg_customers') }}     c ON l.customer_id = c.customer_id
JOIN {{ ref('int_payments_pivoted') }} p ON l.loan_id = p.loan_id`,
      rule: "Named fct_ (facts) or dim_ (dimensions). These are what Looker/Tableau query.",
    },
    {
      id: "exposure",
      label: "Exposure",
      sublabel: "dashboards, ML, apps",
      icon: "📊",
      color: "#38bdf8",
      x: 4,
      tables: ["Portfolio Dashboard", "Credit Risk Model", "Finance Report"],
      what: "Exposures are downstream consumers of your marts — dashboards, ML models, APIs. You declare them in YAML so they appear in your dbt lineage graph and freshness alerts.",
      example: `# models/exposures.yml
exposures:
  - name: loan_portfolio_dashboard
    type: dashboard
    url: https://looker.company.com/42
    depends_on:
      - ref('fct_disbursements')
      - ref('dim_customers')
    owner:
      name: Finance Team`,
      rule: "Not a dbt model — a declaration of who uses your data downstream.",
    },
  ];

  const activeLayer = layers.find((l) => l.id === active);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        Think of dbt like an assembly line for your data. Raw parts (sources)
        come in one end, get cleaned and assembled layer by layer, and a
        finished product (mart table) comes out the other end for analysts to
        use. <strong style={{ color: T.teal }}>Click any layer</strong> to
        understand what happens there.
      </BeginnerNote>

      {/* DAG visualization */}
      <div
        style={{
          background: "rgba(4,9,20,0.9)",
          border: `1px solid ${T.slate}`,
          borderRadius: 12,
          padding: "20px 16px 16px",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            minWidth: 560,
            justifyContent: "center",
          }}
        >
          {layers.map((layer, i) => (
            <div
              key={layer.id}
              style={{ display: "flex", alignItems: "center" }}
            >
              {/* Node */}
              <div
                onClick={() => setActive(active === layer.id ? null : layer.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 10px",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background:
                    active === layer.id
                      ? `${layer.color}18`
                      : "rgba(255,255,255,0.03)",
                  border: `1px solid ${active === layer.id ? layer.color + "66" : "rgba(255,255,255,0.07)"}`,
                  minWidth: 88,
                  transform: active === layer.id ? "scale(1.05)" : "scale(1)",
                  boxShadow:
                    active === layer.id ? `0 0 16px ${layer.color}22` : "none",
                }}
              >
                <span style={{ fontSize: 20 }}>{layer.icon}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: layer.color,
                    fontFamily: "'Bricolage Grotesque',sans-serif",
                  }}
                >
                  {layer.label}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    color: T.grey,
                    fontFamily: "monospace",
                    textAlign: "center",
                  }}
                >
                  {layer.sublabel}
                </span>
                {/* Mini table list */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                    marginTop: 2,
                  }}
                >
                  {layer.tables.map((t) => (
                    <div
                      key={t}
                      style={{
                        fontSize: 8,
                        fontFamily: "monospace",
                        color: active === layer.id ? layer.color : T.greyDark,
                        background: `${layer.color}10`,
                        borderRadius: 4,
                        padding: "1px 5px",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              {/* Arrow */}
              {i < layers.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "0 6px",
                    gap: 2,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 1,
                      background: `${T.greyDark}`,
                    }}
                  />
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: "4px solid transparent",
                      borderBottom: "4px solid transparent",
                      borderLeft: `6px solid ${T.greyDark}`,
                      marginLeft: 22,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Click hint */}
        {!active && (
          <div
            style={{
              textAlign: "center",
              fontSize: 9,
              color: T.greyDark,
              fontFamily: "monospace",
              marginTop: 12,
            }}
          >
            ↑ click any layer to learn what it does
          </div>
        )}
      </div>

      {/* Detail panel */}
      {activeLayer && (
        <div
          style={{
            background: T.surface,
            border: `1px solid ${activeLayer.color}44`,
            borderRadius: 12,
            padding: "16px 18px",
            animation: "popIn 0.2s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 20 }}>{activeLayer.icon}</span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: activeLayer.color,
                fontFamily: "'Bricolage Grotesque',sans-serif",
              }}
            >
              {activeLayer.label} layer
            </span>
            <span
              style={{
                fontSize: 10,
                color: T.grey,
                fontFamily: "monospace",
                marginLeft: "auto",
              }}
            >
              {activeLayer.sublabel}
            </span>
          </div>
          <p
            style={{
              color: "#cbd5e1",
              fontSize: 13,
              lineHeight: 1.7,
              margin: "0 0 12px",
            }}
          >
            {activeLayer.what}
          </p>
          <SectionTitle color={activeLayer.color}>EXAMPLE</SectionTitle>
          <CodeBlock code={activeLayer.example} small />
          <div
            style={{
              marginTop: 10,
              display: "flex",
              gap: 6,
              alignItems: "flex-start",
              background: `${activeLayer.color}09`,
              border: `1px solid ${activeLayer.color}25`,
              borderRadius: 8,
              padding: "8px 12px",
            }}
          >
            <span style={{ fontSize: 12, color: activeLayer.color }}>📌</span>
            <span
              style={{
                fontSize: 11,
                color: T.greyLight,
                fontFamily: "monospace",
              }}
            >
              {activeLayer.rule}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function FundamentalsSlides() {
  const steps = [
    {
      title: "What is dbt?",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            <strong style={{ color: T.teal }}>Imagine this:</strong> Your
            company's raw data lands in your data warehouse — messy column
            names, cents instead of dollars, cryptic IDs. Someone needs to turn
            that into clean tables that analysts can actually use. That job used
            to be done by writing SQL scripts and running them manually. dbt
            automates that entire process.
          </BeginnerNote>
          <p
            style={{
              color: T.greyLight,
              fontSize: 13,
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            dbt stands for{" "}
            <strong style={{ color: "#f1f5f9" }}>data build tool</strong>. It
            lets you write SELECT statements, and dbt handles the CREATE TABLE /
            CREATE VIEW for you. It also adds testing, documentation, and
            version control to your data transformations.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(185px,1fr))",
              gap: 10,
            }}
          >
            {[
              [
                "🏗️",
                "You write SELECT",
                "dbt handles CREATE TABLE / VIEW / SCHEMA",
              ],
              [
                "✅",
                "Testing built in",
                "Assert uniqueness, not-null, referential integrity",
              ],
              [
                "📚",
                "Auto-docs",
                "Generate a data catalog from your code + YAML",
              ],
              [
                "🌿",
                "Version controlled",
                "Every model lives in Git — PRs, reviews, rollback",
              ],
              [
                "🔗",
                "Lineage graph",
                "See exactly which tables depend on which sources",
              ],
              [
                "🚀",
                "Scheduled runs",
                "Deploy on a schedule via dbt Cloud or Airflow",
              ],
            ].map(([icon, title, desc]) => (
              <InfoCard
                key={title}
                icon={icon}
                title={title}
                body={desc}
                color={T.purple}
              />
            ))}
          </div>
          <Callout icon="🤔" title="THE SINGLE KEY IDEA" color={T.teal}>
            In dbt,{" "}
            <strong style={{ color: "#f1f5f9" }}>
              every model is just a SELECT statement
            </strong>
            . You write what data you want. dbt figures out how to materialise
            it in the warehouse. That's it.
          </Callout>
        </div>
      ),
    },
    {
      title: "Project Structure",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            When you run <code style={{ color: T.teal }}>dbt init</code>, it
            creates a folder structure for you. Here's the official structure —
            we've adapted it to a lending/fintech context. Don't worry about
            memorising it; focus on understanding <em>why</em> each folder
            exists.
          </BeginnerNote>
          <CodeBlock
            code={`lending_analytics/
├── README.md
├── dbt_project.yml                          # project config — name, paths, materializations
├── packages.yml                             # external packages like dbt-utils
│
├── analyses/                                # ad hoc SQL (compiled but never run by dbt)
├── seeds/
│   └── country_codes.csv                    # static CSV data — loaded as tables
├── snapshots/                               # SCD Type 2 historical tracking
├── macros/
│   └── cents_to_dollars.sql                 # reusable Jinja helper functions
├── tests/
│   └── assert_positive_total_amount.sql     # custom one-off data tests
│
└── models/
    ├── staging/                             # LAYER 1: clean raw sources, 1-to-1
    │   ├── core_banking/
    │   │   ├── _core_banking__sources.yml   # declare the source tables here
    │   │   ├── _core_banking__models.yml    # column tests + descriptions
    │   │   ├── _core_banking__docs.md       # reusable doc blocks
    │   │   ├── base/
    │   │   │   └── base_core_banking__loans.sql   # dedup/union before staging
    │   │   ├── stg_core_banking__loans.sql
    │   │   └── stg_core_banking__customers.sql
    │   └── payments/
    │       ├── _payments__sources.yml
    │       └── stg_payments__transactions.sql
    │
    ├── intermediate/                        # LAYER 2: complex logic, not for BI tools
    │   └── finance/
    │       ├── _int_finance__models.yml
    │       └── int_payments_pivoted_to_loans.sql
    │
    ├── marts/                               # LAYER 3: final tables consumed by analysts
    │   ├── finance/
    │   │   ├── _finance__models.yml
    │   │   ├── fct_disbursements.sql
    │   │   └── fct_repayments.sql
    │   ├── credit/
    │   │   ├── dim_customers.sql
    │   │   └── fct_defaults.sql
    │   └── operations/
    │       └── fct_loan_events.sql
    │
    └── utilities/
        └── all_dates.sql                    # date spine shared across marts`}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            <InfoCard
              icon="🔵"
              title="staging/"
              body="1-to-1 with source tables. Clean, rename, cast — no joins, no aggregations."
              color={T.purple}
            />
            <InfoCard
              icon="🟡"
              title="intermediate/"
              body="Complex multi-step logic too long for a mart. Never queried by BI tools directly."
              color={T.yellow}
            />
            <InfoCard
              icon="🟠"
              title="marts/"
              body="Final business-facing tables. Organised by domain: finance, credit, operations."
              color={T.orange}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Interactive: Data Layers",
      content: () => <LayerDAG />,
    },
    {
      title: "Sources, Tests & Docs",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            A <strong style={{ color: T.teal }}>source</strong> is any table in
            your warehouse that dbt reads but didn't create. You declare them in
            YAML so dbt can track their freshness and build lineage from them.
          </BeginnerNote>
          <SectionTitle>STEP 1 — DECLARE YOUR SOURCES</SectionTitle>
          <CodeBlock
            code={`# models/staging/core_banking/_core_banking__sources.yml
version: 2
sources:
  - name: core_banking               # a friendly name you choose
    database: lending_db             # your warehouse database name
    schema: raw                      # the schema where raw tables live
    tables:
      - name: loans
        description: "Raw loan records loaded by Fivetran every 30 mins"
        freshness:
          warn_after:  {count: 6,  period: hour}   # warn if data is >6h old
          error_after: {count: 24, period: hour}   # fail if data is >24h old
        loaded_at_field: _fivetran_synced           # column to check freshness`}
          />
          <SectionTitle>
            STEP 2 — REFERENCE SOURCES IN STAGING MODELS
          </SectionTitle>
          <CodeBlock
            code={`-- models/staging/core_banking/stg_core_banking__loans.sql
SELECT
    loan_id,
    customer_id,
    amount / 100 AS loan_amount_usd,   -- cents → dollars
    status,
    created_at::date AS created_date
-- Use source() not a direct table name — dbt tracks the lineage
FROM {{ source('core_banking', 'loans') }}
--   ↑ this is the "name" from sources.yml
--                  ↑ this is the "tables.name"`}
          />
          <SectionTitle>STEP 3 — ADD TESTS TO CATCH BAD DATA</SectionTitle>
          <CodeBlock
            code={`# models/staging/core_banking/_core_banking__models.yml
version: 2
models:
  - name: stg_core_banking__loans
    description: "One row per loan. Cleaned from raw.loans."
    columns:
      - name: loan_id
        description: "Unique identifier for each loan"
        tests:
          - unique          # no duplicate loan IDs allowed
          - not_null        # every row must have a loan_id

      - name: status
        tests:
          - accepted_values:
              values: ['active', 'repaid', 'defaulted', 'written_off']

      - name: customer_id
        tests:
          - relationships:  # every loan must have a matching customer
              to: ref('stg_core_banking__customers')
              field: customer_id`}
          />
          <Callout
            icon="▶️"
            title="RUNNING YOUR FIRST dbt COMMANDS"
            color={T.teal}
          >
            <code style={{ color: T.teal }}>dbt run</code> — builds all your
            models in the warehouse
            <br />
            <code style={{ color: T.teal }}>dbt test</code> — runs all your data
            tests
            <br />
            <code style={{ color: T.teal }}>
              dbt run --select stg_core_banking__loans
            </code>{" "}
            — run just one model
            <br />
            <code style={{ color: T.teal }}>dbt source freshness</code> — check
            if source tables are up to date
          </Callout>
        </div>
      ),
    },
  ];
  return <GenericCourse steps={steps} color={T.purple} />;
}
