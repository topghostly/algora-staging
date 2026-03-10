import React, { useState, useRef } from "react";
import { T } from "./constants";
import {
  BeginnerNote,
  SectionTitle,
  CodeBlock,
  GenericCourse,
  Callout,
  InfoCard,
} from "./shared-ui";

// The table we'll be testing against — visible to learners throughout
export const TEST_TABLE_ROWS = [
  {
    loan_id: "LN-001",
    customer_id: "C-101",
    disbursement_amount: 5000,
    status: "active",
    email: "alice@co.com",
  },
  {
    loan_id: "LN-002",
    customer_id: "C-102",
    disbursement_amount: 1200,
    status: "repaid",
    email: "bob@co.com",
  },
  {
    loan_id: "LN-003",
    customer_id: "C-999",
    disbursement_amount: 3400,
    status: "active",
    email: "carol@co.com",
  }, // C-999 not in dim_customers
  {
    loan_id: "LN-004",
    customer_id: "C-104",
    disbursement_amount: 0,
    status: "defaulted",
    email: null,
  }, // amount=0, null email
  {
    loan_id: "LN-005",
    customer_id: "C-105",
    disbursement_amount: -500,
    status: "suspended",
    email: "eve@co.com",
  }, // negative amount, bad status
  {
    loan_id: "LN-001",
    customer_id: "C-106",
    disbursement_amount: 2000,
    status: "active",
    email: "frank@co.com",
  }, // duplicate loan_id!
  {
    loan_id: "LN-006",
    customer_id: null,
    disbursement_amount: 8000,
    status: "repaid",
    email: "grace@co.com",
  }, // null customer_id
];

export const DIM_CUSTOMERS = [
  "C-101",
  "C-102",
  "C-103",
  "C-104",
  "C-105",
  "C-106",
  "C-107",
];

export const TEST_DEFINITIONS: Record<string, any> = {
  unique: {
    label: "unique",
    color: "#818cf8",
    icon: "🔑",
    desc: "Checks that every value in the column appears only once. Detects duplicate records.",
    yaml: `- name: loan_id
  tests:
    - unique`,
    compiledSQL: `-- dbt compiles "unique" to:
SELECT
  loan_id,
  COUNT(*) AS n
FROM analytics.fct_disbursements
GROUP BY loan_id
HAVING COUNT(*) > 1
-- Any rows returned = FAIL (duplicate IDs found)`,
    failingRows: (rows: any[]) => {
      const counts: Record<string, number> = {};
      rows.forEach((r) => {
        counts[r.loan_id] = (counts[r.loan_id] || 0) + 1;
      });
      return rows.filter((r) => counts[r.loan_id] > 1);
    },
    failReason: (r: any) => `loan_id "${r.loan_id}" appears ${2} times`,
    failColumns: ["loan_id"],
  },
  not_null: {
    label: "not_null",
    color: T.teal,
    icon: "🚫",
    desc: "Checks that no value in the column is NULL. Every row must have a value.",
    yaml: `- name: customer_id
  tests:
    - not_null`,
    compiledSQL: `-- dbt compiles "not_null" to:
SELECT customer_id
FROM analytics.fct_disbursements
WHERE customer_id IS NULL
-- Any rows returned = FAIL (null values found)`,
    failingRows: (rows: any[]) => rows.filter((r) => r.customer_id === null),
    failReason: (r: any) => `customer_id is NULL`,
    failColumns: ["customer_id"],
  },
  accepted_values: {
    label: "accepted_values",
    color: T.orange,
    icon: "📋",
    desc: "Checks that every value in the column is from a predefined allowed list.",
    yaml: `- name: status
  tests:
    - accepted_values:
        values: ['active','repaid','defaulted']`,
    compiledSQL: `-- dbt compiles "accepted_values" to:
SELECT status
FROM analytics.fct_disbursements
WHERE status NOT IN (
  'active', 'repaid', 'defaulted'
)
-- Any rows returned = FAIL (unexpected value)`,
    failingRows: (rows: any[]) =>
      rows.filter((r) => !["active", "repaid", "defaulted"].includes(r.status)),
    failReason: (r: any) => `"${r.status}" is not in allowed values`,
    failColumns: ["status"],
  },
  relationships: {
    label: "relationships",
    color: "#f472b6",
    icon: "🔗",
    desc: "Checks referential integrity — every value must exist in a reference table. Like a foreign key constraint.",
    yaml: `- name: customer_id
  tests:
    - relationships:
        to: ref('dim_customers')
        field: customer_id`,
    compiledSQL: `-- dbt compiles "relationships" to:
SELECT customer_id
FROM analytics.fct_disbursements
WHERE customer_id IS NOT NULL
  AND customer_id NOT IN (
    SELECT customer_id
    FROM analytics.dim_customers
  )
-- Any rows = orphaned records (FK violation)`,
    failingRows: (rows: any[]) =>
      rows.filter(
        (r) => r.customer_id && !DIM_CUSTOMERS.includes(r.customer_id),
      ),
    failReason: (r: any) => `"${r.customer_id}" not found in dim_customers`,
    failColumns: ["customer_id"],
  },
  assert_positive: {
    label: "assert_positive (custom)",
    color: T.green,
    icon: "➕",
    desc: "A custom generic test. Checks that a numeric column is always greater than zero.",
    yaml: `-- macros/test_assert_positive.sql
{% test assert_positive(model, column_name) %}
  SELECT {{ column_name }}
  FROM {{ model }}
  WHERE {{ column_name }} <= 0
{% endtest %}

-- Apply it:
- name: disbursement_amount
  tests:
    - assert_positive`,
    compiledSQL: `-- dbt compiles your custom test to:
SELECT disbursement_amount
FROM analytics.fct_disbursements
WHERE disbursement_amount <= 0
-- Returns failing rows: 0 values and negatives`,
    failingRows: (rows: any[]) =>
      rows.filter((r) => r.disbursement_amount <= 0),
    failReason: (r: any) => `${r.disbursement_amount} is not > 0`,
    failColumns: ["disbursement_amount"],
  },
};

export function TestLab() {
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [tab, setTab] = useState("data"); // "data" | "sql" | "failures"
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const timers = useRef<any[]>([]);

  const testDef = activeTest ? TEST_DEFINITIONS[activeTest] : null;
  const failingRows = testDef ? testDef.failingRows(TEST_TABLE_ROWS) : [];
  const passingRows = testDef
    ? TEST_TABLE_ROWS.filter((r) => !failingRows.includes(r))
    : [];

  const selectTest = (testId: string) => {
    setActiveTest(testId);
    setTab("data");
    setRan(false);
    setRunning(false);
    timers.current.forEach(clearTimeout);
  };

  const runTest = () => {
    setRunning(true);
    setTab("sql");
    setRan(false);
    const t1 = setTimeout(() => setTab("failures"), 1000);
    const t2 = setTimeout(() => {
      setRunning(false);
      setRan(true);
    }, 1200);
    timers.current = [t1, t2];
  };

  const COL_LABELS: Record<string, string> = {
    loan_id: "loan_id",
    customer_id: "customer_id",
    disbursement_amount: "amount",
    status: "status",
    email: "email",
  };
  const COLUMNS = [
    "loan_id",
    "customer_id",
    "disbursement_amount",
    "status",
    "email",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        Below is a real <code style={{ color: T.teal }}>fct_disbursements</code>{" "}
        table with intentional data quality issues hidden in it.{" "}
        <strong style={{ color: T.teal }}>Select a test type</strong> to see its
        YAML config, the SQL dbt compiles it to, and exactly which rows fail.
      </BeginnerNote>

      {/* Test type selector */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {Object.entries(TEST_DEFINITIONS).map(([key, def]) => (
          <button
            key={key}
            onClick={() => selectTest(key)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              transition: "all 0.18s",
              border: `1px solid ${activeTest === key ? def.color : "rgba(255,255,255,0.08)"}`,
              background:
                activeTest === key
                  ? `${def.color}18`
                  : "rgba(255,255,255,0.03)",
              color: activeTest === key ? def.color : T.grey,
              fontWeight: activeTest === key ? 700 : 400,
            }}
          >
            {def.icon} {def.label}
          </button>
        ))}
      </div>

      {/* Source data table — always visible */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <SectionTitle>
            fct_disbursements — source data (7 rows, some with issues)
          </SectionTitle>
          {activeTest && (
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 2,
                    background: T.red,
                  }}
                />
                <span
                  style={{
                    fontSize: 9,
                    color: T.grey,
                    fontFamily: "monospace",
                  }}
                >
                  fails test
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 2,
                    background: T.green,
                  }}
                />
                <span
                  style={{
                    fontSize: 9,
                    color: T.grey,
                    fontFamily: "monospace",
                  }}
                >
                  passes test
                </span>
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            background: "rgba(4,9,20,0.95)",
            border: `1px solid ${activeTest ? testDef.color + "33" : T.slate}`,
            borderRadius: 10,
            overflow: "auto",
            transition: "border-color 0.3s",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.slate}` }}>
                {COLUMNS.map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "6px 10px",
                      textAlign: "left",
                      fontSize: 9,
                      color:
                        activeTest && testDef.failColumns.includes(col)
                          ? testDef.color
                          : T.greyDark,
                      fontWeight:
                        activeTest && testDef.failColumns.includes(col)
                          ? 800
                          : 600,
                      letterSpacing: 0.5,
                      whiteSpace: "nowrap",
                      borderBottom:
                        activeTest && testDef.failColumns.includes(col)
                          ? `2px solid ${testDef.color}55`
                          : "none",
                    }}
                  >
                    {COL_LABELS[col]}
                    {activeTest && testDef.failColumns.includes(col) && (
                      <span
                        style={{
                          marginLeft: 4,
                          fontSize: 8,
                          color: testDef.color,
                        }}
                      >
                        ← tested
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEST_TABLE_ROWS.map((row: any, ri) => {
                const isFailing = activeTest && failingRows.includes(row);
                const isPassing = activeTest && !isFailing;
                return (
                  <tr
                    key={ri}
                    style={{
                      borderBottom:
                        ri < TEST_TABLE_ROWS.length - 1
                          ? `1px solid ${T.slate}22`
                          : "none",
                      background: isFailing
                        ? "rgba(248,113,113,0.08)"
                        : isPassing
                          ? "rgba(74,222,128,0.04)"
                          : "transparent",
                      transition: "background 0.3s",
                    }}
                  >
                    {COLUMNS.map((col) => {
                      const val = row[col];
                      const isBadCell =
                        activeTest &&
                        testDef.failColumns.includes(col) &&
                        isFailing;
                      const isNull = val === null || val === undefined;
                      return (
                        <td
                          key={col}
                          style={{
                            padding: "6px 10px",
                            fontSize: 10,
                            color: isBadCell
                              ? T.red
                              : isNull
                                ? T.greyDark
                                : T.greyLight,
                            fontStyle: isNull ? "italic" : "normal",
                            fontWeight: isBadCell ? 700 : 400,
                            position: "relative",
                          }}
                        >
                          {isNull ? "NULL" : String(val)}
                          {isBadCell && (
                            <span
                              style={{
                                marginLeft: 5,
                                fontSize: 9,
                                color: T.red,
                              }}
                            >
                              ✕
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {activeTest && (
          <div
            style={{
              marginTop: 5,
              fontSize: 10,
              color: T.greyDark,
              fontFamily: "monospace",
            }}
          >
            {failingRows.length > 0 ? (
              <span style={{ color: T.red }}>
                ⚠️ {failingRows.length} row{failingRows.length > 1 ? "s" : ""}{" "}
                would fail this test
              </span>
            ) : (
              <span style={{ color: T.green }}>✓ All rows pass this test</span>
            )}
          </div>
        )}
      </div>

      {/* Detail panel — only when a test is selected */}
      {activeTest && (
        <div
          style={{
            background: "rgba(4,9,20,0.95)",
            border: `1px solid ${testDef.color}33`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {/* Test header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: `1px solid ${testDef.color}22`,
              background: `${testDef.color}09`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 18 }}>{testDef.icon}</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: testDef.color,
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                }}
              >
                {testDef.label}
              </span>
              <span
                style={{
                  fontSize: 9,
                  background: `${testDef.color}18`,
                  color: testDef.color,
                  border: `1px solid ${testDef.color}33`,
                  padding: "2px 8px",
                  borderRadius: 10,
                  fontFamily: "monospace",
                  marginLeft: "auto",
                }}
              >
                {failingRows.length === 0
                  ? "✓ 0 failures"
                  : `✕ ${failingRows.length} failure${failingRows.length > 1 ? "s" : ""}`}
              </span>
            </div>
            <div style={{ fontSize: 12, color: T.greyLight, lineHeight: 1.6 }}>
              {testDef.desc}
            </div>
          </div>

          {/* Tabs */}
          <div
            style={{ display: "flex", borderBottom: `1px solid ${T.slate}` }}
          >
            {[
              ["data", "📋 YAML Config"],
              ["sql", "⚙️ Compiled SQL"],
              ["failures", "🔍 Failing Rows"],
            ].map(([t, label]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "8px 14px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 10,
                  fontFamily: "'JetBrains Mono',monospace",
                  transition: "all 0.18s",
                  color: tab === t ? testDef.color : T.grey,
                  borderBottom:
                    tab === t
                      ? `2px solid ${testDef.color}`
                      : "2px solid transparent",
                  fontWeight: tab === t ? 700 : 400,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ padding: "14px 16px" }}>
            {/* YAML tab */}
            {tab === "data" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: T.greyDark,
                    fontFamily: "monospace",
                    letterSpacing: 0.5,
                  }}
                >
                  HOW TO DECLARE THIS TEST IN YOUR YAML
                </div>
                <CodeBlock code={testDef.yaml} small />
                {activeTest === "assert_positive" && (
                  <Callout
                    icon="🧩"
                    title="CUSTOM GENERIC TESTS"
                    color={T.green}
                  >
                    Unlike built-in tests,{" "}
                    <code style={{ color: T.green }}>assert_positive</code> is a
                    macro you write yourself in{" "}
                    <code style={{ color: T.green }}>macros/</code>. Once
                    defined, apply it to any column in any model — it works
                    exactly like the built-in ones.
                  </Callout>
                )}
              </div>
            )}

            {/* Compiled SQL tab */}
            {tab === "sql" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: T.greyDark,
                    fontFamily: "monospace",
                    letterSpacing: 0.5,
                  }}
                >
                  THE SQL dbt SENDS TO YOUR WAREHOUSE
                </div>
                <CodeBlock code={testDef.compiledSQL} small />
                <Callout
                  icon="🧠"
                  title="THE GOLDEN RULE"
                  color={testDef.color}
                >
                  Every single dbt test — built-in or custom — compiles to a SQL
                  query.{" "}
                  <strong style={{ color: "#f1f5f9" }}>
                    0 rows returned = test passes.
                  </strong>{" "}
                  Any rows returned = those ARE the failing records. There are
                  no exceptions to this rule.
                </Callout>
              </div>
            )}

            {/* Failures tab */}
            {tab === "failures" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {failingRows.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                    <div
                      style={{
                        fontSize: 13,
                        color: T.green,
                        fontFamily: "'Bricolage Grotesque',sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      Test passes — 0 rows returned
                    </div>
                    <div style={{ fontSize: 11, color: T.grey, marginTop: 4 }}>
                      The compiled SQL query found no violations in the data.
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9,
                          color: T.red,
                          fontFamily: "monospace",
                          letterSpacing: 0.5,
                        }}
                      >
                        ROWS RETURNED BY THE TEST QUERY — {failingRows.length}{" "}
                        FAILURE{failingRows.length > 1 ? "S" : ""}
                      </div>
                    </div>

                    {/* Failing rows detail */}
                    <div
                      style={{
                        background: "rgba(248,113,113,0.06)",
                        border: "1px solid rgba(248,113,113,0.2)",
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontFamily: "'JetBrains Mono',monospace",
                        }}
                      >
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${T.slate}` }}>
                            {[...testDef.failColumns, "failure_reason"].map(
                              (h) => (
                                <th
                                  key={h}
                                  style={{
                                    padding: "6px 10px",
                                    textAlign: "left",
                                    fontSize: 9,
                                    color: T.red,
                                    fontWeight: 700,
                                    letterSpacing: 0.5,
                                  }}
                                >
                                  {h}
                                </th>
                              ),
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {failingRows.map((row: any, ri: number) => (
                            <tr
                              key={ri}
                              style={{
                                borderBottom:
                                  ri < failingRows.length - 1
                                    ? `1px solid ${T.slate}33`
                                    : "none",
                              }}
                            >
                              {testDef.failColumns.map((col: string) => (
                                <td
                                  key={col}
                                  style={{
                                    padding: "5px 10px",
                                    fontSize: 10,
                                    color: T.red,
                                    fontWeight: 700,
                                    fontStyle:
                                      row[col] === null ? "italic" : "normal",
                                  }}
                                >
                                  {row[col] === null
                                    ? "NULL"
                                    : String(row[col])}
                                </td>
                              ))}
                              <td
                                style={{
                                  padding: "5px 10px",
                                  fontSize: 10,
                                  color: T.greyLight,
                                }}
                              >
                                {testDef.failReason(row)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* store_failures explanation */}
                    <div
                      style={{
                        background: `${testDef.color}08`,
                        border: `1px solid ${testDef.color}25`,
                        borderRadius: 8,
                        padding: "10px 12px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9,
                          color: testDef.color,
                          fontFamily: "monospace",
                          letterSpacing: 0.5,
                          marginBottom: 6,
                        }}
                      >
                        💾 WANT dbt TO SAVE THESE ROWS FOR YOU? USE
                        store_failures
                      </div>
                      <CodeBlock
                        code={`- name: ${testDef.failColumns[0]}
  tests:
    - ${activeTest === "assert_positive" ? "assert_positive" : activeTest}:
        store_failures: true      # ← add this
        schema: test_failures     # saves to test_failures.${activeTest}_${testDef.failColumns[0]}
# After dbt test runs, query the failures table:
SELECT * FROM test_failures.${activeTest}_${testDef.failColumns[0]};`}
                        small
                      />
                    </div>

                    {/* Severity configuration */}
                    <div
                      style={{
                        background: "rgba(250,204,21,0.07)",
                        border: "1px solid rgba(250,204,21,0.2)",
                        borderRadius: 8,
                        padding: "10px 12px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9,
                          color: T.yellow,
                          fontFamily: "monospace",
                          letterSpacing: 0.5,
                          marginBottom: 6,
                        }}
                      >
                        ⚠️ SHOULD THIS FAILURE STOP THE ENTIRE RUN? CONFIGURE
                        SEVERITY
                      </div>
                      <CodeBlock
                        code={`- name: ${testDef.failColumns[0]}
  tests:
    - ${activeTest === "assert_positive" ? "assert_positive" : activeTest}:
        severity: error    # ← FAIL the run (default)
        # severity: warn   # ← just log a warning, run continues
        # warn_if:  ">5"   # warn only if more than 5 failures
        # error_if: ">50"  # error only if more than 50 failures`}
                        small
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {!activeTest && (
        <div
          style={{
            textAlign: "center",
            padding: "16px 0",
            fontSize: 11,
            color: T.greyDark,
            fontFamily: "monospace",
          }}
        >
          ↑ select a test type above to inspect the data and see which rows fail
        </div>
      )}
    </div>
  );
}

export function TestRunner() {
  // Keep this as a quick "run all" view that uses the TestLab's test definitions
  const tests = [
    {
      id: "unique_loan_id",
      model: "fct_disbursements",
      column: "loan_id",
      type: "unique",
      severity: "error",
      failingRows: TEST_DEFINITIONS.unique.failingRows(TEST_TABLE_ROWS),
    },
    {
      id: "not_null_custid",
      model: "fct_disbursements",
      column: "customer_id",
      type: "not_null",
      severity: "error",
      failingRows: TEST_DEFINITIONS.not_null.failingRows(TEST_TABLE_ROWS),
    },
    {
      id: "accepted_status",
      model: "fct_disbursements",
      column: "status",
      type: "accepted_values",
      severity: "error",
      failingRows:
        TEST_DEFINITIONS.accepted_values.failingRows(TEST_TABLE_ROWS),
    },
    {
      id: "fk_customer",
      model: "fct_disbursements",
      column: "customer_id",
      type: "relationships",
      severity: "error",
      failingRows: TEST_DEFINITIONS.relationships.failingRows(TEST_TABLE_ROWS),
    },
    {
      id: "positive_amount",
      model: "fct_disbursements",
      column: "disbursement_amount",
      type: "assert_positive",
      severity: "error",
      failingRows:
        TEST_DEFINITIONS.assert_positive.failingRows(TEST_TABLE_ROWS),
    },
    {
      id: "not_null_email",
      model: "dim_customers",
      column: "email",
      type: "not_null",
      severity: "warn",
      failingRows: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
        { id: 11 },
        { id: 12 },
      ],
    },
  ];

  const [visible, setVisible] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const timers = useRef<any[]>([]);

  const runAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setVisible([]);
    setRunning(true);
    setRan(false);
    tests.forEach((t, i) => {
      const timer = setTimeout(() => {
        setVisible((prev) => [...prev, t.id]);
        if (i === tests.length - 1) {
          setTimeout(() => {
            setRunning(false);
            setRan(true);
          }, 300);
        }
      }, i * 320);
      timers.current.push(timer);
    });
  };

  const errors = tests.filter(
    (t) =>
      visible.includes(t.id) &&
      t.failingRows.length > 0 &&
      t.severity === "error",
  );
  const warns = tests.filter(
    (t) =>
      visible.includes(t.id) &&
      t.failingRows.length > 0 &&
      t.severity === "warn",
  );
  const passing = tests.filter(
    (t) => visible.includes(t.id) && t.failingRows.length === 0,
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <BeginnerNote>
        Run all tests at once and watch them execute. A test{" "}
        <strong style={{ color: T.green }}>passes</strong> if its SQL returns 0
        rows. It <strong style={{ color: T.red }}>fails</strong> if any rows are
        returned. Notice how some failures stop the run and some are just
        warnings.
      </BeginnerNote>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={runAll}
          disabled={running}
          style={{
            padding: "8px 22px",
            borderRadius: 8,
            fontSize: 11,
            cursor: running ? "not-allowed" : "pointer",
            fontFamily: "'JetBrains Mono',monospace",
            fontWeight: 700,
            transition: "all 0.2s",
            border: `1px solid ${T.teal}55`,
            background: running ? `${T.teal}06` : `${T.teal}18`,
            color: running ? T.grey : T.teal,
          }}
        >
          {running
            ? "⚙️  Running tests..."
            : ran
              ? "↩ Run again"
              : "▶  dbt test --select fct_disbursements"}
        </button>
        {ran && !running && (
          <div
            style={{
              fontSize: 10,
              color: errors.length > 0 ? T.red : T.green,
              fontFamily: "monospace",
            }}
          >
            {errors.length > 0
              ? `❌ Run FAILED — ${errors.length} test error${errors.length > 1 ? "s" : ""}`
              : "✅ Run passed"}
          </div>
        )}
      </div>

      {/* Test results */}
      {visible.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {tests
            .filter((t) => visible.includes(t.id))
            .map((t) => {
              const failing = t.failingRows.length > 0;
              const isErr = failing && t.severity === "error";
              const isWarn = failing && t.severity === "warn";
              const color = isErr ? T.red : isWarn ? T.yellow : T.green;
              const testColor = TEST_DEFINITIONS[t.type]?.color || T.teal;
              return (
                <div
                  key={t.id}
                  style={{
                    background: `${color}08`,
                    border: `1px solid ${color}22`,
                    borderRadius: 8,
                    padding: "8px 12px",
                    animation: "slideIn 0.25s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 13 }}>
                    {isErr ? "❌" : isWarn ? "⚠️" : "✅"}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <code
                        style={{
                          fontSize: 10,
                          color: testColor,
                          fontFamily: "monospace",
                          fontWeight: 700,
                        }}
                      >
                        {t.type}
                      </code>
                      <span
                        style={{
                          fontSize: 9,
                          color: T.greyDark,
                          fontFamily: "monospace",
                        }}
                      >
                        on {t.model}.{t.column}
                      </span>
                    </div>
                  </div>
                  {failing && (
                    <span
                      style={{
                        fontSize: 9,
                        background: `${color}18`,
                        color,
                        border: `1px solid ${color}33`,
                        padding: "2px 7px",
                        borderRadius: 8,
                        fontFamily: "monospace",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.failingRows.length}{" "}
                      {t.severity === "warn" ? "warnings" : "failures"}
                    </span>
                  )}
                  {t.severity === "warn" && failing && (
                    <span
                      style={{
                        fontSize: 8,
                        color: T.greyDark,
                        fontFamily: "monospace",
                      }}
                    >
                      severity: warn — run continues
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* Summary */}
      {ran && !running && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            animation: "fadeUp 0.3s ease",
          }}
        >
          {[
            [passing.length, T.green, "PASSED", "Query returned 0 rows"],
            [
              errors.length,
              T.red,
              "ERRORS — run STOPS",
              "Job blocks, PR blocked",
            ],
            [
              warns.length,
              T.yellow,
              "WARNINGS — run continues",
              "Logged but not blocking",
            ],
          ].map(([count, color, label, sublabel]: any) => (
            <div
              key={label}
              style={{
                background: `${color}09`,
                border: `1px solid ${color}25`,
                borderRadius: 8,
                padding: "10px 12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color,
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                }}
              >
                {count}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: 8,
                  color: T.greyDark,
                  fontFamily: "monospace",
                  marginTop: 2,
                }}
              >
                {sublabel}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TestingSlides() {
  const steps = [
    {
      title: "How dbt Tests Work",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            Every dbt test is secretly a SQL query.{" "}
            <strong style={{ color: T.teal }}>
              If the query returns 0 rows → test passes. If it returns any rows
              → those rows ARE the bad data.
            </strong>{" "}
            This one rule applies to every test — built-in or custom.
          </BeginnerNote>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <SectionTitle color={T.teal}>THE 4 BUILT-IN TESTS</SectionTitle>
              <CodeBlock
                code={`# models/schema.yml
- name: fct_disbursements
  columns:
    - name: loan_id
      tests:
        - unique          # no duplicates
        - not_null        # must have a value

    - name: status
      tests:
        - accepted_values:
            values: ['active','repaid','defaulted']

    - name: customer_id
      tests:
        - relationships:  # must exist in dim_customers
            to: ref('dim_customers')
            field: customer_id`}
                small
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <SectionTitle color={T.teal}>WHAT THEY COMPILE TO</SectionTitle>
              <CodeBlock
                code={`-- "unique" test:
SELECT loan_id, COUNT(*) AS n
FROM analytics.fct_disbursements
GROUP BY loan_id HAVING COUNT(*) > 1
-- 0 rows = ✅ pass

-- "not_null" test:
SELECT loan_id
FROM analytics.fct_disbursements
WHERE loan_id IS NULL
-- 0 rows = ✅ pass`}
                small
              />
              <InfoCard
                icon="🧠"
                title="The key insight"
                body="dbt tests are just SQL. Any rows returned by the test query = those rows have a data quality problem. This is why you can write your own tests so easily."
                color={T.teal}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "🔬 Test Lab — Inspect Each Test",
      content: () => <TestLab />,
    },
    {
      title: "▶ Run All Tests",
      content: () => <TestRunner />,
    },
    {
      title: "Custom Generic Tests",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            When the 4 built-in tests aren't enough for your business rules,
            write a custom generic test. It's a Jinja macro that returns failing
            rows — the same contract as every built-in test.
          </BeginnerNote>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <SectionTitle color={T.teal}>
                1. DEFINE ONCE IN macros/
              </SectionTitle>
              <CodeBlock
                code={`-- macros/test_assert_positive.sql
{% test assert_positive(model, column_name) %}

  -- Returns the rows that fail.
  -- 0 rows = test passes.
  SELECT {{ column_name }}
  FROM {{ model }}
  WHERE {{ column_name }} <= 0

{% endtest %}

-- Another example:
{% test between(model, column_name, min, max) %}
  SELECT {{ column_name }}
  FROM {{ model }}
  WHERE {{ column_name }} < {{ min }}
     OR {{ column_name }} > {{ max }}
{% endtest %}`}
                small
              />
            </div>
            <div>
              <SectionTitle>2. APPLY TO ANY MODEL, ANY COLUMN</SectionTitle>
              <CodeBlock
                code={`# Works exactly like built-in tests:
- name: disbursement_amount
  tests:
    - assert_positive        # custom ✓
    - not_null               # built-in ✓
    - between:               # custom ✓
        min: 100
        max: 10000000

- name: fee_amount
  tests:
    - assert_positive        # reuse it!

- name: interest_rate
  tests:
    - between:               # reuse again!
        min: 0
        max: 100`}
                small
              />
              <Callout
                icon="💡"
                title="PACKAGES ADD MORE TESTS"
                color={T.purple}
              >
                Install{" "}
                <code style={{ color: T.purple }}>
                  calogica/dbt_expectations
                </code>{" "}
                to get 50+ extra tests like{" "}
                <code style={{ color: T.purple }}>
                  expect_column_values_to_be_of_type
                </code>
                ,{" "}
                <code style={{ color: T.purple }}>
                  expect_row_count_to_be_between
                </code>
                , and more.
              </Callout>
            </div>
          </div>
        </div>
      ),
    },
  ];
  return <GenericCourse steps={steps} color={T.teal} />;
}
