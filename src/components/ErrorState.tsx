"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onReload?: () => void;
}

export function ErrorState({
  message = "Something went wrong while loading the data.",
  onReload,
}: ErrorStateProps) {
  const handleReload = () => {
    if (onReload) {
      onReload();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in duration-500">
      <div className="bg-red-50 p-3 rounded-full mb-4">
        <AlertCircle size={32} className="text-red-600" />
      </div>
      <h3 className="mb-2">Something went wrong</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
        {message}
      </p>
      <button
        onClick={handleReload}
        className="btn btn-outline flex items-center gap-2 px-6 py-2 text-sm h-auto"
      >
        <RefreshCcw size={16} />
        Retry
      </button>
    </div>
  );
}
