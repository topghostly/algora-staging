"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import Plyr from "plyr";
import "plyr/dist/plyr.css";

type Props = {
  videoId: string;
  lessonId: string;
  isCompleted: boolean;
  trackId: string;
};

export default function VideoPlayer({
  videoId,
  lessonId,
  isCompleted,
  trackId,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const updateProgesss = async () => {
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

  useEffect(() => {
    if (!ref.current) return;

    const player = new Plyr(ref.current, {
      controls: [
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "fullscreen",
      ],

      autoplay: false,
      clickToPlay: true,
      hideControls: true,
      resetOnEnd: true,

      keyboard: {
        focused: false,
        global: false,
      },

      tooltips: {
        controls: false,
        seek: false,
      },

      fullscreen: {
        enabled: true,
        iosNative: false,
      },

      youtube: {
        noCookie: true,
        rel: 0,
        modestbranding: 1,
        showinfo: 0,
        iv_load_policy: 3,
        playsinline: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
      },
    });

    player.on("ended", () => {
      if (isCompleted) return;
      updateProgesss();
    });

    return () => {
      player.destroy();
    };
  }, []);

  return (
    <>
      <div
        ref={ref}
        className="plyr__video-embed"
        data-plyr-provider="youtube"
        data-plyr-embed-id={videoId}
      />
      {/* 
        This style block blocks pointer events on the YouTube iframe seamlessly.
        It prevents YouTube's hover UI (title bar, watch later) from appearing, 
        blocks the YouTube clickable logo, and disables the context menu.
      */}
      <style>{`
        .plyr__video-embed iframe {
          pointer-events: none !important;
        }
      `}</style>
    </>
  );
}
