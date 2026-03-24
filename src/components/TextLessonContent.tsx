"use client";

import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[60vh] flex items-center justify-center bg-muted/10 rounded-2xl border border-border">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Initializing viewer...</p>
      </div>
    </div>
  ),
});

interface TextLessonContentProps {
  lessonId: string;
  isCompleted: boolean;
  contentUrl?: string | null;
  textContent?: string | null;
  title: string;
}

export default function TextLessonContent({
  lessonId,
  isCompleted,
  contentUrl,
  textContent,
  title,
}: TextLessonContentProps) {
  if (contentUrl) {
    return (
      <PDFViewer
        url={contentUrl}
        lessonId={lessonId}
        isCompleted={isCompleted}
      />
    );
  }

  if (textContent) {
    return (
      <div
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: textContent }}
      />
    );
  }

  return (
    <div className="text-center py-10 text-muted-foreground">
      No content available for this lesson.
    </div>
  );
}
