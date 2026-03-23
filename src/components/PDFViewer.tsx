"use client";

import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { fullScreenPlugin } from "@react-pdf-viewer/full-screen";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/full-screen/lib/styles/index.css";

import { useRouter } from "next/navigation";

interface PDFViewerProps {
  url: string;
  lessonId: string;
  isCompleted: boolean;
}

export default function PDFViewer({
  url,
  lessonId,
  isCompleted,
}: PDFViewerProps) {
  const router = useRouter();
  const zoomPluginInstance = zoomPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const fullScreenPluginInstance = fullScreenPlugin();

  const { ZoomIn, ZoomOut, Zoom } = zoomPluginInstance;
  const { CurrentPageInput, GoToNextPage, GoToPreviousPage, NumberOfPages } =
    pageNavigationPluginInstance;
  const { EnterFullScreen } = fullScreenPluginInstance;

  const updateProgress = async () => {
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completed: true }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Progress update error:", error);
    }
  };

  const handlePageChange = (e: { currentPage: number; doc: any }) => {
    if (isCompleted) return;

    const totalPages = e.doc.numPages;
    const progress = (e.currentPage + 1) / totalPages;

    if (progress >= 0.7) {
      updateProgress();
    }
  };

  return (
    <div className="flex flex-col w-full h-[85vh] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-950">
      {/* Custom Minimal Toolbar */}
      {/* <div className="flex items-center justify-between w-full px-4 py-0 md:py-2 bg-white dark:bg-zinc-900 z-10">
        <div className="flex items-center gap-1">
          <div className="p-1 hover:bg-muted-light rounded-lg transition-colors">
            <GoToPreviousPage />
          </div>
          <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
            <CurrentPageInput />
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium">
              <NumberOfPages />
            </span>
          </div>
          <div className="p-1 hover:bg-muted-light rounded-lg transition-colors">
            <GoToNextPage />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 hover:bg-muted-light rounded-lg transition-colors">
            <ZoomOut />
          </div>
          <div className="flex items-center min-w-[60px] justify-center">
            <Zoom />
          </div>
          <div className="p-1 hover:bg-muted-light rounded-lg transition-colors">
            <ZoomIn />
          </div>
        </div>

        <div className="flex items-center">
          <div className="p-1 hover:bg-muted-light rounded-lg transition-colors">
            <EnterFullScreen />
          </div>
        </div>
      </div> */}

      <div className="flex-1 overflow-hidden relative">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3/build/pdf.worker.min.js">
          <Viewer
            fileUrl={url}
            plugins={[
              zoomPluginInstance,
              pageNavigationPluginInstance,
              fullScreenPluginInstance,
            ]}
            defaultScale={SpecialZoomLevel.PageFit}
            onPageChange={handlePageChange}
          />
        </Worker>
      </div>
    </div>
  );
}
