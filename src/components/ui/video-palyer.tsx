"use client";

import { useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

type Props = {
  videoId: string;
};

export default function VideoPlayer({ videoId }: Props) {
  const ref = useRef<HTMLDivElement>(null);

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
