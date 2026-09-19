"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP } from "@/components/motion/gsap";

import type { FilmFrame } from "@/content/film";

export function Filmstrip({ frames }: { frames: FilmFrame[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useGSAP(() => {
    const el = scroller.current;
    if (!el) return;

    const onScroll = () => {
      const width = el.clientWidth;
      if (!width) return;
      setIndex(Math.round(el.scrollLeft / width));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (direction: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    const next = Math.min(frames.length - 1, Math.max(0, index + direction));
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollTo({
      left: next * el.clientWidth,
      behavior: reduce ? "auto" : "smooth",
    });
    setIndex(next);
  };

  return (
    <div className="relative">
      <div
        ref={scroller}
        className="flex snap-x snap-mandatory overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {frames.map((frame) => (
          <figure
            key={frame.src}
            className="relative h-[70vh] w-full shrink-0 snap-center"
          >
            <Image
              src={frame.src}
              alt={frame.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </figure>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between text-body">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Previous frame"
          className="disabled:opacity-30"
        >
          ←
        </button>
        <p aria-live="polite" className="text-eyebrow text-muted">
          {frames[index]?.location} · {index + 1}/{frames.length}
        </p>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={index === frames.length - 1}
          aria-label="Next frame"
          className="disabled:opacity-30"
        >
          →
        </button>
      </div>
    </div>
  );
}
