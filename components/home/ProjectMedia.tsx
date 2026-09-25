"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { projectMedia } from "@/lib/project-card";
import type { ProjectCard } from "@/lib/sanity/types";

/** Filmstrip inside the Watch Club hero still (1702×943). */
const HERO_FRAME = {
  imageWidth: 1702,
  imageHeight: 943,
  x: 154,
  y: 184,
  width: 1396,
  height: 574,
  radius: 14,
};

function heroFrameStyle(boxWidth: number, boxHeight: number): CSSProperties | null {
  if (boxWidth <= 0 || boxHeight <= 0) return null;
  const scale = Math.max(
    boxWidth / HERO_FRAME.imageWidth,
    boxHeight / HERO_FRAME.imageHeight,
  );
  const displayedWidth = HERO_FRAME.imageWidth * scale;
  const displayedHeight = HERO_FRAME.imageHeight * scale;
  return {
    left: (boxWidth - displayedWidth) / 2 + HERO_FRAME.x * scale,
    top: (boxHeight - displayedHeight) / 2 + HERO_FRAME.y * scale,
    width: HERO_FRAME.width * scale,
    height: HERO_FRAME.height * scale,
    borderRadius: HERO_FRAME.radius * scale,
  };
}

export function ProjectMedia({
  card,
  playing = false,
  hoverVideo = false,
  className = "",
}: {
  card: ProjectCard;
  playing?: boolean;
  hoverVideo?: boolean;
  className?: string;
}) {
  const media = projectMedia(card);
  const poster = media?.poster ?? (media?.type === "image" ? media.src : undefined);
  const showVideo = hoverVideo && playing && media?.type === "video";
  const insetHero = Boolean(poster?.includes("-1702x943"));
  const boxRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<CSSProperties | null>(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      const rect = box.getBoundingClientRect();
      setFrame(heroFrameStyle(rect.width, rect.height));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!showVideo) setVisible(false);
  }, [showVideo]);

  return (
    <div
      ref={boxRef}
      className={`project-media relative aspect-video w-full overflow-hidden rounded-lg bg-subtle ${className}`.trim()}
    >
      {poster ? (
        <Image
          src={poster}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={`object-cover transition-opacity duration-150 ${visible ? "opacity-0" : "opacity-100"}`}
        />
      ) : null}
      {showVideo ? (
        <video
          key={media.src}
          src={media.src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVisible(true)}
          onPlaying={() => setVisible(true)}
          style={insetHero ? (frame ?? { visibility: "hidden" }) : undefined}
          className={`absolute object-cover transition-opacity duration-150 ${
            insetHero ? "" : "inset-0 h-full w-full"
          } ${visible && (!insetHero || frame) ? "opacity-100" : "opacity-0"}`}
        />
      ) : null}
    </div>
  );
}
