"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";

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
    <div className="flex flex-col items-center justify-center py-6 px-3 md:py-12 md:px-6 text-center animate-in fade-in duration-500">
      <div className="bg-red-50 p-3 rounded-full mb-4">
        <AlertCircle size={32} className="text-red-600" />
      </div>
      <h3 className="mb-2">Something went wrong</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
        {message}
      </p>
      <Button onClick={handleReload} variant={"outline"} size={"sm"}>
        <RefreshCcw size={16} />
        Retry
      </Button>
    </div>
  );
}
