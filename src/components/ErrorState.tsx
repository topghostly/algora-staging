"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import { LottieAnimation } from "./NotFoundAnimation";

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
      <div className="flex mx-auto h-60 w-60 md:h-72 md:w-72 items-center justify-center overflow-hidden mb-6">
        <LottieAnimation
          jsonPath="/json/error.json"
          fallbackWebm="/videos/error.webm"
        />
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
