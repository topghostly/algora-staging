"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Circle,
  PlayCircle,
  FileText,
  Menu,
  X,
} from "lucide-react";

interface LessonLayoutProps {
  track: any;
  currentLesson: any;
  children: React.ReactNode;
}

export default function LessonLayout({
  track,
  currentLesson,
  children,
}: LessonLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on navigation (on mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [currentLesson.id]);

  return (
    <div className="flex h-[calc(100vh-68px)] overflow-hidden relative">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-40 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
        aria-label="Open lessons menu"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[300px] bg-background border-r border-border transition-transform duration-300 transform
          lg:relative lg:translate-x-0 lg:z-auto py-3 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-medium leading-tight line-clamp-2">
              {track.title}
            </h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-muted rounded-md transition-colors"
            >
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {track.modules.map((module: any) => (
              <div key={module.id} className="border-b border-border">
                <div className="px-6 py-4 bg-muted/30 font-semibold text-sm text-foreground">
                  {module.title}
                </div>
                <div>
                  {module.lessons.map((lesson: any) => {
                    const isActive = lesson.id === currentLesson.id;
                    const isLessonCompleted = lesson.progress.length > 0;

                    return (
                      <Link
                        key={lesson.id}
                        href={`/tracks/${track.id}/lessons/${lesson.id}`}
                        className={`
                          flex items-center gap-3 px-6 py-3 text-sm transition-all
                          border-l-4 
                          ${
                            isActive
                              ? "border-primary bg-primary/5 text-primary font-medium"
                              : "border-transparent text-foreground hover:bg-muted/50"
                          }
                        `}
                      >
                        {isLessonCompleted ? (
                          <CheckCircle size={16} className="text-primary" />
                        ) : (
                          <Circle size={16} className="text-muted-foreground" />
                        )}
                        <span className="flex-1">{lesson.title}</span>
                        {lesson.type === "VIDEO" ? (
                          <PlayCircle
                            size={14}
                            className="text-muted-foreground"
                          />
                        ) : (
                          <FileText
                            size={14}
                            className="text-muted-foreground"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide relative bg-background">
        {children}
      </main>
    </div>
  );
}
