"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import Plyr from "plyr";
import "plyr/dist/plyr.css";
// import { revalidatePage } from "@/app/actions/revalidate";

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
      },
    });

    player.on("ended", () => {
      if (isCompleted) return;
      updateProgesss();
      // revalidatePage(`/tracks/`);
      // revalidatePage(`/tracks/${trackId}`);
      // revalidatePage(`/tracks/${trackId}/lessons`);
      // router.refresh();
    });

    return () => {
      player.destroy();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="plyr__video-embed"
      data-plyr-provider="youtube"
      data-plyr-embed-id={videoId}
    />
  );
}
