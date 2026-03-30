import React, { useState } from "react";
import { T } from "../../components/constants";
import {
  BeginnerNote,
  SectionTitle,
  CodeBlock,
  GenericCourse,
  Callout,
  InfoCard,
} from "../../components/shared-ui";

export function SQLvsPythonToggle() {
  const [view, setView] = useState("sql");
  const [usecase, setUsecase] = useState("risk");

  const usecases: Record<string, any> = {
    risk: {
      label: "Risk Scoring",
      why: "You need to score loans using a trained ML model. SQL has no ML inference capability — Python is the only option.",
      sql: `-- ❌ SQL cannot do this:
-- There is no native ML inference in SQL.
-- You'd have to export data, score externally,
-- then re-import. Fragile, slow, not reproducible.

-- The best SQL can do is a simple rule:
SELECT
  loan_id,
  CASE
    WHEN missed_payments > 2 THEN 'high'
    WHEN missed_payments = 1 THEN 'medium'
    ELSE 'low'
  END AS risk_tier   -- crude, not an ML model
FROM {{ ref('fct_disbursements') }}`,
      python: `# ✅ Python model: models/ml/loan_risk_score.py
def model(dbt, session):
    dbt.config(
        materialized="table",
        packages=["scikit-learn","pandas"]
    )

    # ref() works just like SQL models
    loans = dbt.ref("fct_disbursements").to_pandas()
    features = dbt.ref("feat_loan_features").to_pandas()

    from sklearn.ensemble import RandomForestClassifier
    clf = RandomForestClassifier(n_estimators=100)
    clf.fit(features[FEATURE_COLS], features["label"])

    loans["risk_score"]  = clf.predict_proba(
        loans[FEATURE_COLS])[:, 1]
    loans["risk_tier"] = loans["risk_score"].apply(
        lambda x: "high" if x>0.7 else "medium" if x>0.4 else "low"
    )
    # Return a DataFrame → dbt writes it as a table
    return loans[["loan_id","risk_score","risk_tier"]]`,
    },
    text: {
      label: "Text Processing",
      why: "Extracting intent from free-text loan application notes requires NLP libraries. SQL cannot do this natively.",
      sql: `-- ❌ SQL can do basic text ops:
SELECT
  application_id,
  LOWER(notes) AS notes_lower,
  -- Can find keywords, but no NLP:
  CASE WHEN notes ILIKE '%urgent%' THEN 'urgent'
       WHEN notes ILIKE '%student%' THEN 'education'
       ELSE 'other'
  END AS loan_purpose
-- No sentiment, no entity extraction,
-- no embeddings — all require Python`,
      python: `# ✅ Python model: models/ml/loan_purpose_classifier.py
def model(dbt, session):
    dbt.config(
        materialized="table",
        packages=["transformers","torch"]
    )
    apps = dbt.ref("stg_applications").to_pandas()

    from transformers import pipeline
    classifier = pipeline("zero-shot-classification")

    LABELS = ["business","education","medical","personal"]
    apps["loan_purpose"] = apps["notes"].apply(
        lambda text: classifier(text, LABELS)["labels"][0]
    )
    apps["confidence"] = apps["notes"].apply(
        lambda text: classifier(text, LABELS)["scores"][0]
    )
    return apps[["application_id","loan_purpose","confidence"]]`,
    },
    stats: {
      label: "Statistical Analysis",
      why: "Business wants percentile analysis and outlier detection on loan amounts. SQL percentiles are limited; Python statsmodels gives full control.",
      sql: `-- SQL can do basic percentiles:
SELECT
  PERCENTILE_CONT(0.5) WITHIN GROUP
    (ORDER BY disbursement_amount) AS median,
  PERCENTILE_CONT(0.95) WITHIN GROUP
    (ORDER BY disbursement_amount) AS p95
FROM {{ ref('fct_disbursements') }}

-- But cannot do:
-- IQR-based outlier detection
-- Bootstrap confidence intervals
-- Distribution fitting (is it log-normal?)`,
      python: `# ✅ Python: full stats power
def model(dbt, session):
    dbt.config(materialized="table")
    df = dbt.ref("fct_disbursements").to_pandas()

    import numpy as np
    from scipy import stats

    # IQR outlier detection
    Q1, Q3 = df["amount"].quantile([0.25, 0.75])
    IQR = Q3 - Q1
    df["is_outlier"] = (
        (df["amount"] < Q1 - 1.5 * IQR) |
        (df["amount"] > Q3 + 1.5 * IQR)
    )

    # Fit a distribution
    shape, loc, scale = stats.lognorm.fit(df["amount"])
    df["log_normal_p"] = stats.lognorm.pdf(
        df["amount"], shape, loc, scale)

    return df[["loan_id","amount","is_outlier","log_normal_p"]]`,
    },
  };

  const uc = usecases[usecase];
  const color = T.yellow;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        Python models solve things SQL simply cannot. Choose a use case below,
        then toggle between the SQL attempt and the Python solution to see the
        difference.
      </BeginnerNote>

      {/* Use case selector */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {Object.entries(usecases).map(([key, uc]) => (
          <button
            key={key}
            onClick={() => {
              setUsecase(key);
              setView("sql");
            }}
            style={{
              padding: "5px 13px",
              borderRadius: 20,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              transition: "all 0.18s",
              border: `1px solid ${usecase === key ? color : "rgba(255,255,255,0.08)"}`,
              background: usecase === key ? `${color}18` : "transparent",
              color: usecase === key ? color : T.grey,
            }}
          >
            {uc.label}
          </button>
        ))}
      </div>

      {/* Why Python */}
      <Callout icon="🤔" title="WHY YOU NEED PYTHON HERE" color={color}>
        {uc.why}
      </Callout>

      {/* SQL vs Python toggle */}
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={() => setView("sql")}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: 8,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "'JetBrains Mono',monospace",
            fontWeight: 700,
            transition: "all 0.2s",
            border: `1px solid ${view === "sql" ? T.red : "rgba(255,255,255,0.08)"}`,
            background:
              view === "sql"
                ? "rgba(248,113,113,0.12)"
                : "rgba(255,255,255,0.03)",
            color: view === "sql" ? T.red : T.grey,
          }}
        >
          ❌ SQL attempt
        </button>
        <button
          onClick={() => setView("python")}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: 8,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "'JetBrains Mono',monospace",
            fontWeight: 700,
            transition: "all 0.2s",
            border: `1px solid ${view === "python" ? color : "rgba(255,255,255,0.08)"}`,
            background:
              view === "python" ? `${color}12` : "rgba(255,255,255,0.03)",
            color: view === "python" ? color : T.grey,
          }}
        >
          ✅ Python model
        </button>
      </div>
      <CodeBlock code={view === "sql" ? uc.sql : uc.python} />
    </div>
  );
}

export function PythonSlides() {
  const steps = [
    {
      title: "Python dbt Models",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            dbt Python models let you run Python{" "}
            <strong style={{ color: T.yellow }}>inside your warehouse</strong> —
            no data moves to your laptop. They use{" "}
            <code style={{ color: T.yellow }}>ref()</code> just like SQL models,
            so lineage is tracked and they fit naturally into your DAG.
          </BeginnerNote>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <InfoCard
              icon="📊"
              title="Use SQL for"
              body="Joins, aggregations, filters, window functions, GROUP BY — the vast majority of transformations."
              color={T.blue}
            />
            <InfoCard
              icon="🐍"
              title="Use Python for"
              body="ML model scoring, NLP/text processing, statistical analysis, calling external APIs, complex array operations that SQL can't do."
              color={T.yellow}
            />
          </div>
          <Callout
            icon="⚠️"
            title="Python model restrictions (per dbt docs)"
            color={T.orange}
          >
            Python models <strong style={{ color: "#f1f5f9" }}>cannot</strong>{" "}
            be materialised as <code style={{ color: T.orange }}>view</code> or{" "}
            <code style={{ color: T.orange }}>ephemeral</code> — only{" "}
            <code style={{ color: T.green }}>table</code> or{" "}
            <code style={{ color: T.green }}>incremental</code>. Python is also
            not supported for dbt tests or snapshots — those must be SQL.
          </Callout>
          <SectionTitle>PYTHON MODEL ANATOMY</SectionTitle>
          <CodeBlock
            code={`# models/ml/loan_risk_score.py  ← .py not .sql!

def model(dbt, session):
    # ① Configure: same as {{ config() }} in SQL
    dbt.config(
        materialized = "table",
        packages     = ["scikit-learn", "pandas"]
    )

    # ② Reference dbt models — works across SQL and Python!
    loans    = dbt.ref("fct_disbursements").to_pandas()
    features = dbt.ref("feat_loan_features").to_pandas()

    # ③ Use any Python library
    from sklearn.ensemble import RandomForestClassifier
    clf = RandomForestClassifier()
    clf.fit(features[COLS], features["label"])

    # ④ Return a DataFrame — dbt writes it to the warehouse
    loans["risk_score"] = clf.predict_proba(loans[COLS])[:, 1]
    return loans[["loan_id", "risk_score"]]`}
          />
        </div>
      ),
    },
    {
      title: "Interactive: SQL vs Python",
      content: () => <SQLvsPythonToggle />,
    },
  ];
  return <GenericCourse steps={steps} color={T.yellow} />;
}
