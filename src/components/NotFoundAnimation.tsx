"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottieAnimationProps {
  jsonPath: string;
  fallbackWebm: string;
}

export function LottieAnimation({
  jsonPath,
  fallbackWebm,
}: LottieAnimationProps) {
  const [animationData, setAnimationData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(jsonPath)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setAnimationData(data))
      .catch(() => setError(true));
  }, [jsonPath]);

  if (error) {
    return (
      <video
        src={fallbackWebm}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />
    );
  }

  if (!animationData) {
    return (
      <div className="h-full w-full bg-muted/20 animate-pulse rounded-full" />
    );
  }

  return (
    <Lottie
      animationData={animationData}
      loop={true}
      autoplay={true}
      className="h-full w-full object-contain"
    />
  );
}

// Backwards-compatible alias
export function NotFoundAnimation() {
  return (
    <LottieAnimation
      jsonPath="/json/empty.json"
      fallbackWebm="/videos/empty.webm"
    />
  );
}
