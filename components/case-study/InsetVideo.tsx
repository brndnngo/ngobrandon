"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  insetItemStyle,
  type MediaPadding,
} from "@/lib/media-inset";

export function InsetVideo({
  src,
  poster,
  padding,
}: {
  src: string;
  poster?: string;
  padding?: MediaPadding;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ratio, setRatio] = useState<number | null>(null);

  useLayoutEffect(() => {
    const video = ref.current;
    if (!video) return;

    const sync = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setRatio(video.videoWidth / video.videoHeight);
      }
    };

    sync();
    video.addEventListener("loadedmetadata", sync);
    return () => video.removeEventListener("loadedmetadata", sync);
  }, [src]);

  return (
    <video
      ref={ref}
      className={
        ratio
          ? "cs-media-inset-item cs-media-inset-sized"
          : "cs-media-inset-item"
      }
      style={
        ratio
          ? insetItemStyle(ratio, padding)
          : { ...insetItemStyle(undefined, padding), visibility: "hidden" }
      }
      src={src}
      poster={poster}
      muted
      autoPlay
      loop
      playsInline
    />
  );
}
