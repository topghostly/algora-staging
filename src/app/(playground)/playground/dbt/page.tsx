"use client";
import React, { useState } from "react";
import { T, GLOBAL_STYLES, DIFF_COLOR } from "../components/constants";
import { Tag } from "../components/shared-ui";
import { COURSES, CourseCatalog } from "./components/Catalog";

// Import course components
import { FundamentalsSlides } from "./components/Fundamentals";
import { JinjaSlides } from "./components/Jinja";
import { IncrementalCourse } from "./components/Incremental";
import { SnapshotsSlides } from "./components/Snapshots";
import { SeedsSlides } from "./components/Seeds";
import { ExposuresSlides } from "./components/Exposures";
import { StateSlides } from "./components/StateManagement";
import { RetrySlides } from "./components/Retry";
import { MeshSlides } from "./components/Mesh";
import { TestingSlides } from "./components/Testing";
import { DeploymentSlides } from "./components/Deployment";
import { CloneSlides } from "./components/Clone";
import { GrantsSlides } from "./components/Grants";
import { PythonSlides } from "./components/PythonModels";

const COURSE_COMPONENTS: Record<string, React.ComponentType> = {
  fundamentals: FundamentalsSlides,
  jinja: JinjaSlides,
  incremental: IncrementalCourse,
  snapshots: SnapshotsSlides,
  seeds: SeedsSlides,
  exposures: ExposuresSlides,
  state: StateSlides,
  retry: RetrySlides,
  mesh: MeshSlides,
  testing: TestingSlides,
  deployment: DeploymentSlides,
  clone: CloneSlides,
  grants: GrantsSlides,
  python: PythonSlides,
};

import PlaygroundTopHeader from "../components/palyground-top-header";

export default function PlaygroundPage() {
  const [view, setView] = useState("home");
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  const openCourse = (id: string) => {
    setActiveCourseId(id);
    setView("course");
  };

  const goHome = () => {
    setView("home");
    setActiveCourseId(null);
  };

  const course = COURSES.find((c) => c.id === activeCourseId);
  const CourseComponent = activeCourseId
    ? COURSE_COMPONENTS[activeCourseId]
    : null;

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      {view === "home" ? (
        <>
          <PlaygroundTopHeader />
          <CourseCatalog onSelect={openCourse} />
        </>
      ) : (
        <div
          style={{
            minHeight: "100vh",
            color: "#f1f5f9",
            fontFamily: "'Onest',sans-serif",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <PlaygroundTopHeader onBack={goHome} backText="All Courses">
            <div style={{ width: 1, height: 18, background: T.slate }} />
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: `${course?.color}15`,
                border: `1px solid ${course?.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
              }}
            >
              {course?.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#f1f5f9",
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                }}
              >
                {course?.title}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: T.greyDark,
                  fontFamily: "monospace",
                }}
              >
                {course?.subtitle}
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              {course && course.difficulty && (
                <Tag
                  label={course.difficulty}
                  color={DIFF_COLOR[course.difficulty]}
                />
              )}
              <span
                style={{
                  fontSize: 9,
                  padding: "2px 8px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  color: T.greyDark,
                  border: "1px solid rgba(255,255,255,0.06)",
                  fontFamily: "monospace",
                }}
              >
                ⏱ {course?.duration}
              </span>
            </div>
          </PlaygroundTopHeader>

          {/* Course title */}
          <div
            style={{
              textAlign: "center",
              padding: "24px 20px 12px",
              borderBottom: `1px solid ${T.slate}30`,
              background: `linear-gradient(to bottom, ${course?.color}08, transparent)`,
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{course?.icon}</div>
            <h1
              style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontSize: 26,
                fontWeight: 800,
                margin: 0,
                letterSpacing: -0.5,
                color: "#f1f5f9",
              }}
            >
              {course?.title}
            </h1>
            <div style={{ fontSize: 13, color: T.grey, marginTop: 4 }}>
              {course?.subtitle}
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              padding: "16px 24px 40px",
              maxWidth: 800,
              margin: "0 auto",
              width: "100%",
            }}
          >
            {CourseComponent && <CourseComponent />}
          </div>
        </div>
      )}
    </>
  );
}
