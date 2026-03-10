import React, { useState } from "react";
import { T } from "./constants";
import {
  BeginnerNote,
  SectionTitle,
  CodeBlock,
  GenericCourse,
  InfoCard,
} from "./shared-ui";

export function MeshAccessExplorer() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState("finance_analytics");

  const models = [
    {
      id: "stg_loans",
      project: "lending_core",
      access: "private",
      group: "data_eng",
      label: "stg_loans",
      desc: "Cleaned staging model. Private — internal use only.",
    },
    {
      id: "int_payments",
      project: "lending_core",
      access: "protected",
      group: "data_eng",
      label: "int_payments",
      desc: "Intermediate pivot. Protected — only lending_core models can ref it.",
    },
    {
      id: "mart_loans",
      project: "lending_core",
      access: "public",
      group: "data_eng",
      label: "mart_loans",
      desc: "Public interface. Any project can ref() this with a contract.",
    },
    {
      id: "mart_payments",
      project: "lending_core",
      access: "public",
      group: "data_eng",
      label: "mart_payments",
      desc: "Public interface. Contractually enforced schema.",
    },
    {
      id: "fct_revenue",
      project: "finance_analytics",
      access: "private",
      group: "finance",
      label: "fct_revenue",
      desc: "Finance-only model. References mart_loans from lending_core.",
    },
    {
      id: "rpt_portfolio",
      project: "credit_analytics",
      access: "private",
      group: "credit_risk",
      label: "rpt_portfolio",
      desc: "Credit risk report. References mart_loans from lending_core.",
    },
  ];

  const projects = [
    {
      id: "lending_core",
      label: "lending_core",
      color: "#c084fc",
      owner: "Data Engineering",
      icon: "🏭",
    },
    {
      id: "finance_analytics",
      label: "finance_analytics",
      color: T.blue,
      owner: "Finance Team",
      icon: "💰",
    },
    {
      id: "credit_analytics",
      label: "credit_analytics",
      color: T.teal,
      owner: "Credit Risk Team",
      icon: "📊",
    },
  ];

  const ACCESS_COLOR: Record<string, string> = {
    public: "#4ade80",
    protected: "#facc15",
    private: "#94a3b8",
  };

  const canRef = (fromProject: string, model: any) => {
    if (fromProject === model.project) return true;
    if (model.access === "public") return true;
    return false;
  };

  const active = models.find((m) => m.id === selectedModel);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BeginnerNote>
        dbt Mesh uses{" "}
        <strong style={{ color: "#c084fc" }}>access levels</strong> to control
        which projects can reference which models.{" "}
        <strong style={{ color: "#c084fc" }}>Click a model</strong> to see its
        access level, then{" "}
        <strong style={{ color: "#c084fc" }}>
          switch the consumer project
        </strong>{" "}
        to see whether it can ref() that model.
      </BeginnerNote>

      {/* Project selector */}
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 10, color: T.grey, fontFamily: "monospace" }}>
          Consumer project (trying to ref a model):
        </span>
        {projects
          .filter((p) => p.id !== "lending_core")
          .map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p.id)}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                fontSize: 10,
                cursor: "pointer",
                fontFamily: "'JetBrains Mono',monospace",
                transition: "all 0.18s",
                border: `1px solid ${selectedProject === p.id ? p.color : "rgba(255,255,255,0.08)"}`,
                background:
                  selectedProject === p.id ? `${p.color}18` : "transparent",
                color: selectedProject === p.id ? p.color : T.grey,
              }}
            >
              {p.icon} {p.id}
            </button>
          ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {Object.entries(ACCESS_COLOR).map(([a, c]) => (
          <div
            key={a}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <div
              style={{ width: 7, height: 7, borderRadius: 2, background: c }}
            />
            <span
              style={{ fontSize: 9, color: T.grey, fontFamily: "monospace" }}
            >
              {a}
            </span>
          </div>
        ))}
      </div>

      {/* Project boxes */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {projects.map((proj) => (
          <div
            key={proj.id}
            style={{
              background: `${proj.color}07`,
              border: `1px solid ${proj.color}22`,
              borderRadius: 10,
              padding: "12px 14px",
              flex: "1 1 180px",
              minWidth: 180,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: proj.color,
                fontFamily: "'Bricolage Grotesque',sans-serif",
                marginBottom: 4,
              }}
            >
              {proj.icon} {proj.label}
            </div>
            <div
              style={{
                fontSize: 9,
                color: T.grey,
                fontFamily: "monospace",
                marginBottom: 10,
              }}
            >
              {proj.owner}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {models
                .filter((m) => m.project === proj.id)
                .map((m) => {
                  const reachable = canRef(selectedProject, m);
                  const isActive = selectedModel === m.id;
                  const ac = ACCESS_COLOR[m.access];
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedModel(isActive ? null : m.id)}
                      style={{
                        padding: "6px 9px",
                        borderRadius: 7,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        border: `1px solid ${isActive ? ac + "88" : "rgba(255,255,255,0.07)"}`,
                        background: isActive
                          ? `${ac}14`
                          : "rgba(255,255,255,0.03)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          fontFamily: "'JetBrains Mono',monospace",
                          color: isActive ? ac : T.greyDark,
                        }}
                      >
                        {m.label}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 8,
                            fontFamily: "monospace",
                            padding: "1px 5px",
                            borderRadius: 8,
                            background: `${ac}18`,
                            color: ac,
                          }}
                        >
                          {m.access}
                        </span>
                        {proj.id !== "lending_core" &&
                          proj.id === selectedProject && (
                            <span style={{ fontSize: 10 }}>
                              {reachable ? "✅" : "🚫"}
                            </span>
                          )}
                        {proj.id === "lending_core" &&
                          selectedProject !== "lending_core" && (
                            <span style={{ fontSize: 10 }}>
                              {reachable ? "✅" : "🚫"}
                            </span>
                          )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {active && (
        <div
          style={{
            background: T.surface,
            border: `1px solid ${ACCESS_COLOR[active.access]}44`,
            borderRadius: 10,
            padding: "12px 14px",
            animation: "popIn 0.2s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <code
              style={{
                fontSize: 12,
                color: ACCESS_COLOR[active.access],
                fontFamily: "monospace",
              }}
            >
              {active.label}
            </code>
            <span
              style={{
                fontSize: 9,
                background: `${ACCESS_COLOR[active.access]}18`,
                color: ACCESS_COLOR[active.access],
                border: `1px solid ${ACCESS_COLOR[active.access]}44`,
                padding: "1px 7px",
                borderRadius: 10,
                fontFamily: "monospace",
              }}
            >
              {active.access}
            </span>
          </div>
          <p
            style={{
              fontSize: 12,
              color: T.greyLight,
              lineHeight: 1.6,
              margin: "0 0 8px",
            }}
          >
            {active.desc}
          </p>
          {canRef(selectedProject, active) ? (
            <CodeBlock
              code={`-- ✅ ${selectedProject} CAN reference this:
FROM {{ ref('${active.project}', '${active.label}') }}`}
              small
            />
          ) : (
            <CodeBlock
              code={`-- 🚫 ${selectedProject} CANNOT reference this:
-- access: ${active.access} means only ${active.project} can use it`}
              small
            />
          )}
        </div>
      )}
    </div>
  );
}

export function MeshSlides() {
  const steps = [
    {
      title: "What is dbt Mesh?",
      content: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <BeginnerNote>
            Imagine 5 teams all editing one dbt project with 1,000 models. Every
            PR blocks everyone else. dbt Mesh solves this by letting each team
            own <strong style={{ color: "#c084fc" }}>their own project</strong>{" "}
            while being able to safely reference another team's stable,
            published models.
          </BeginnerNote>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "rgba(192,132,252,0.07)",
                border: "1px solid rgba(192,132,252,0.2)",
                borderRadius: 10,
                padding: 14,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#c084fc",
                  fontFamily: "monospace",
                  marginBottom: 8,
                }}
              >
                PRODUCER PROJECT
                <br />
                <span style={{ fontSize: 9, fontWeight: 400 }}>
                  lending_core (Data Eng team)
                </span>
              </div>
              <CodeBlock
                code={`# mart_loans is PUBLIC — any project can use it
# contract: enforced means schema is locked
models:
  - name: mart_loans
    access: public
    config:
      contract:
        enforced: true
    columns:
      - name: loan_id
        data_type: varchar
        constraints:
          - type: not_null`}
                small
              />
            </div>
            <div
              style={{ textAlign: "center", color: "#c084fc", fontSize: 20 }}
            >
              →
            </div>
            <div
              style={{
                background: "rgba(192,132,252,0.07)",
                border: "1px solid rgba(192,132,252,0.2)",
                borderRadius: 10,
                padding: 14,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#c084fc",
                  fontFamily: "monospace",
                  marginBottom: 8,
                }}
              >
                CONSUMER PROJECT
                <br />
                <span style={{ fontSize: 9, fontWeight: 400 }}>
                  finance_analytics (Finance team)
                </span>
              </div>
              <CodeBlock
                code={`-- Cross-project ref() syntax:
-- ref('project_name', 'model_name')
SELECT
  l.loan_id,
  l.amount,
  l.status
FROM {{ ref('lending_core', 'mart_loans') }} l
-- If lending_core changes mart_loans schema
-- → CI fails → Finance is protected ✓`}
                small
              />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            <InfoCard
              icon="🔓"
              title="access: public"
              body="Any project can ref() this. Use for stable interfaces between teams. Schema must be contractually defined."
              color="#c084fc"
            />
            <InfoCard
              icon="🔒"
              title="access: private"
              body="Only models within the same project can ref() this. Internal implementation detail — hidden from other teams."
              color="#c084fc"
            />
            <InfoCard
              icon="🛡️"
              title="access: protected"
              body="Only models in the same project OR same group can ref() this. Middle ground between public and private."
              color="#c084fc"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Interactive: Access Explorer",
      content: () => <MeshAccessExplorer />,
    },
  ];
  return <GenericCourse steps={steps} color="#c084fc" />;
}
