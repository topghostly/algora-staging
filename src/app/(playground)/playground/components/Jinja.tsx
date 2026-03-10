import React, { useState } from "react";
import { T } from "./constants";
import {
  CodeBlock,
  SectionTitle,
  BeginnerNote,
  GenericCourse,
} from "./shared-ui";

function JinjaCompiler() {
  const examples = [
    {
      label: "ref()",
      jinja: `SELECT
    loan_id,
    amount,
    status
FROM {{ ref('stg_core_banking__loans') }}
WHERE status = 'active'`,
      sql: `SELECT
    loan_id,
    amount,
    status
FROM "lending_db"."dbt_damilare"."stg_core_banking__loans"
WHERE status = 'active'`,
      explain:
        "ref() is the most important dbt function. It replaces the raw table name with the fully-qualified warehouse path AND tells dbt 'this model depends on that one' — which is how dbt builds its lineage graph.",
    },
    {
      label: "{% if %}",
      jinja: `SELECT *
FROM {{ ref('stg_loans') }}

{% if target.name == 'prod' %}
  WHERE created_date >= '2024-01-01'
{% else %}
  -- In dev: only last 30 days to keep it fast
  WHERE created_date >= DATEADD('day', -30, CURRENT_DATE())
  LIMIT 500
{% endif %}`,
      sql: `-- When target = dev:
SELECT *
FROM "lending_db"."dbt_damilare"."stg_loans"
  -- In dev: only last 30 days to keep it fast
  WHERE created_date >= DATEADD('day', -30, CURRENT_DATE())
  LIMIT 500

-- When target = prod:
SELECT *
FROM "lending_db"."analytics"."stg_loans"
  WHERE created_date >= '2024-01-01'`,
      explain:
        "target.name is a built-in dbt variable that tells you which environment you're running in. Use it to make dev runs faster (less data) while prod runs the full dataset.",
    },
    {
      label: "{% for %}",
      jinja: `SELECT
    loan_id,
    {% for status in ['active','repaid','defaulted'] %}
    SUM(CASE WHEN status = '{{ status }}'
             THEN amount ELSE 0 END)
        AS total_{{ status }}_amount
    {{ "," if not loop.last }}
    {% endfor %}
FROM {{ ref('stg_loans') }}
GROUP BY loan_id`,
      sql: `SELECT
    loan_id,
    SUM(CASE WHEN status = 'active'
             THEN amount ELSE 0 END)
        AS total_active_amount,
    SUM(CASE WHEN status = 'repaid'
             THEN amount ELSE 0 END)
        AS total_repaid_amount,
    SUM(CASE WHEN status = 'defaulted'
             THEN amount ELSE 0 END)
        AS total_defaulted_amount
FROM "lending_db"."analytics"."stg_loans"
GROUP BY loan_id`,
      explain:
        "{% for %} loops generate repeated SQL. Instead of copy-pasting the same CASE WHEN 10 times, write it once and loop over a list. Perfect for pivoting or generating many similar columns.",
    },
    {
      label: "macro call",
      jinja: `-- macros/cents_to_dollars.sql
{% macro cents_to_dollars(col, precision=2) %}
  ROUND({{ col }} / 100.0, {{ precision }})
{% endmacro %}

-- In your model:
SELECT
    loan_id,
    {{ cents_to_dollars('raw_amount') }}
        AS loan_amount_usd,
    {{ cents_to_dollars('raw_fee', 4) }}
        AS fee_usd
FROM {{ source('raw', 'loans') }}`,
      sql: `SELECT
    loan_id,
    ROUND(raw_amount / 100.0, 2)
        AS loan_amount_usd,
    ROUND(raw_fee / 100.0, 4)
        AS fee_usd
FROM "lending_db"."raw"."loans"`,
      explain:
        "Macros are reusable Jinja functions. Define cents_to_dollars once in macros/ and call it anywhere. If the logic ever changes (e.g. different rounding), you fix it in one place.",
    },
  ];

  const [selected, setSelected] = useState(0);
  const ex = examples[selected];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <BeginnerNote>
        When you run <code style={{ color: T.teal }}>dbt compile</code>, dbt
        processes all the Jinja in your models and outputs pure SQL. This is
        called <strong style={{ color: T.teal }}>compilation</strong>. Click
        each example to see what your Jinja becomes after compilation.
      </BeginnerNote>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {examples.map((e, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              padding: "5px 13px",
              borderRadius: 20,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              transition: "all 0.18s",
              border: `1px solid ${selected === i ? T.pink : "rgba(255,255,255,0.08)"}`,
              background: selected === i ? `${T.pink}18` : "transparent",
              color: selected === i ? T.pink : T.grey,
            }}
          >
            {e.label}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 10,
          alignItems: "flex-start",
        }}
      >
        <div>
          <SectionTitle color={T.pink}>YOUR JINJA (dbt model)</SectionTitle>
          <CodeBlock code={ex.jinja} small />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 32,
            gap: 4,
          }}
        >
          <div style={{ fontSize: 9, color: T.grey, fontFamily: "monospace" }}>
            dbt compile
          </div>
          <div style={{ fontSize: 18, color: T.pink }}>→</div>
        </div>
        <div>
          <SectionTitle color={T.teal}>
            COMPILED SQL (sent to your warehouse)
          </SectionTitle>
          <CodeBlock code={ex.sql} small />
        </div>
      </div>
      <div
        style={{
          background: `${T.pink}09`,
          border: `1px solid ${T.pink}28`,
          borderRadius: 10,
          padding: "10px 14px",
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: T.pink,
            fontFamily: "monospace",
            marginBottom: 4,
            letterSpacing: 0.5,
          }}
        >
          🧠 WHY THIS MATTERS
        </div>
        <div style={{ fontSize: 12, color: T.greyLight, lineHeight: 1.65 }}>
          {ex.explain}
        </div>
      </div>
    </div>
  );
}

export function JinjaSlides() {
  const steps = [
    {
      title: "Jinja in dbt",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            dbt models aren't plain SQL — they're{" "}
            <strong style={{ color: T.pink }}>SQL templates</strong>. Before dbt
            sends SQL to your warehouse, it runs the file through a templating
            engine called <strong style={{ color: T.pink }}>Jinja</strong>.
            Jinja adds logic, variables, and loops to SQL.
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
                "{{ }}",
                T.orange,
                "Expression\n— outputs a value",
                `{{ ref('stg_loans') }}\n{{ var('start_date') }}\n{{ target.schema }}`,
              ],
              [
                "{% %}",
                T.pink,
                "Statement\n— logic, no output",
                `{% if target.name == 'prod' %}\n  ...\n{% endif %}\n{% for col in cols %}`,
              ],
              [
                "{# #}",
                T.grey,
                "Comment\n— not compiled",
                `{# This won't appear\n   in the compiled SQL #}`,
              ],
            ].map(([syntax, color, desc, example]) => (
              <div
                key={syntax}
                style={{
                  background: `${color}09`,
                  border: `1px solid ${color}28`,
                  borderRadius: 10,
                  padding: "12px 14px",
                }}
              >
                <code
                  style={{
                    fontSize: 18,
                    color,
                    fontFamily: "'JetBrains Mono',monospace",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {syntax}
                </code>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#f1f5f9",
                    marginBottom: 4,
                    whiteSpace: "pre-line",
                    fontFamily: "'Onest',sans-serif",
                  }}
                >
                  {desc}
                </div>
                <CodeBlock code={example} small />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Interactive: Jinja → SQL",
      content: () => <JinjaCompiler />,
    },
    {
      title: "Writing Macros",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            A <strong style={{ color: T.pink }}>macro</strong> is like a
            function in Python, but for SQL. You define it once, and call it in
            any model. If the logic changes, you only fix it in one place.
          </BeginnerNote>
          <SectionTitle>PROBLEM: COPY-PASTE SQL IS FRAGILE</SectionTitle>
          <CodeBlock
            code={`-- Without a macro — repeated in 15 models:
ROUND(disbursement_amount / 100.0, 2) AS disbursement_usd
ROUND(repayment_amount / 100.0, 2) AS repayment_usd
ROUND(fee_amount / 100.0, 2) AS fee_usd
-- If the rule changes → you edit 15 files 😱`}
            small
          />
          <SectionTitle>SOLUTION: WRITE A MACRO ONCE</SectionTitle>
          <CodeBlock
            code={`-- macros/cents_to_dollars.sql
{%- macro cents_to_dollars(column_name, precision=2) -%}
  ROUND({{ column_name }} / 100.0, {{ precision }})
{%- endmacro -%}

-- Now use it in ANY model:
SELECT
    loan_id,
    {{ cents_to_dollars('disbursement_amount') }}    AS disbursement_usd,
    {{ cents_to_dollars('repayment_amount') }}       AS repayment_usd,
    {{ cents_to_dollars('fee_amount', precision=4) }} AS fee_usd
FROM {{ ref('stg_loans') }}`}
          />
          <SectionTitle>
            A MORE ADVANCED MACRO: GENERATE A SURROGATE KEY
          </SectionTitle>
          <CodeBlock
            code={`-- macros/generate_surrogate_key.sql
{% macro surrogate_key(fields) %}
  MD5(
    CONCAT_WS('||',
      {% for field in fields %}
        CAST({{ field }} AS VARCHAR){{ "," if not loop.last }}
      {% endfor %}
    )
  )
{% endmacro %}

-- Usage:
SELECT
    {{ surrogate_key(['loan_id', 'payment_date', 'transaction_id']) }}
        AS unique_key,
    loan_id,
    payment_date
FROM {{ ref('int_payments') }}`}
          />
        </div>
      ),
    },
    {
      title: "dbt Packages",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            Packages are like npm/pip for dbt. Other people have already solved
            common problems (surrogate keys, date spines, pivot tables) and
            published them as packages. You install them and use their macros
            for free.
          </BeginnerNote>
          <SectionTitle>INSTALL PACKAGES</SectionTitle>
          <CodeBlock
            code={`# packages.yml  (at your project root)
packages:
  - package: dbt-labs/dbt_utils       # the most popular dbt package
    version: 1.2.0
  - package: calogica/dbt_expectations # port of Great Expectations
    version: 0.10.1

# Then run once to download them:
dbt deps`}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginTop: 4,
            }}
          >
            <div>
              <SectionTitle color={T.pink}>
                dbt_utils — most used macros
              </SectionTitle>
              <CodeBlock
                code={`-- Surrogate key from multiple columns:
{{ dbt_utils.generate_surrogate_key(
    ['loan_id', 'payment_date']
) }}

-- Date spine (generate every date in a range):
{{ dbt_utils.date_spine(
    datepart="day",
    start_date="cast('2024-01-01' as date)",
    end_date="cast('2025-01-01' as date)"
) }}

-- Safe divide (avoids divide-by-zero errors):
{{ dbt_utils.safe_divide('numerator', 'denominator') }}`}
                small
              />
            </div>
            <div>
              <SectionTitle color={T.teal}>
                dbt_expectations — data tests
              </SectionTitle>
              <CodeBlock
                code={`# In your schema.yml tests:
- name: loan_amount
  tests:
    - dbt_expectations.expect_column_values_to_be_between:
        min_value: 0
        max_value: 10000000

- name: created_date
  tests:
    - dbt_expectations.expect_column_values_to_of_type:
        column_type: date

- name: loan_id
  tests:
    - dbt_expectations.expect_column_values_to_match_regex:
        regex: "^LN-[0-9]{6}$"`}
                small
              />
            </div>
          </div>
        </div>
      ),
    },
  ];
  return <GenericCourse steps={steps} color={T.pink} />;
}
