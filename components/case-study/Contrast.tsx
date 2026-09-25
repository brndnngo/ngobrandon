"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";

const AFTER_DOTS = 10;
// Last dot starts within ~300ms of the first, in the 30–60ms range.
const STAGGER = 0.033;
const RISE = 0.55;

function opacityAt(index: number, count: number) {
  if (count <= 1) return 1;
  return 1 - (index / (count - 1)) * 0.86;
}

function restingOpacity(target: Element) {
  return Number((target as HTMLElement).dataset.opacity);
}

export function Contrast({
  before,
  after,
}: {
  before: { heading: string; label: string };
  after: { heading: string; label: string };
}) {
  const root = useRef<HTMLElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      const dots = gsap.utils.toArray<HTMLElement>(
        "[data-stagger]",
        root.current,
      );
      const single = root.current?.querySelector<HTMLElement>("[data-single]");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(dots, {
          opacity: (_index, element) => restingOpacity(element),
          y: 0,
          scale: 1,
        });
        if (single) gsap.set(single, { opacity: 1, scale: 1, y: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(dots, { opacity: 0, y: 4, scale: 0.86 });
        if (single) gsap.set(single, { opacity: 0, y: 0, scale: 0.86 });

        const intro = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            once: true,
          },
        });

        if (single) {
          intro.to(
            single,
            { opacity: 1, scale: 1, duration: RISE, ease: "sine.out" },
            0,
          );
        }

        intro.to(
          dots,
          {
            opacity: (_index, element) => restingOpacity(element),
            y: 0,
            scale: 1,
            duration: RISE,
            ease: "sine.out",
            stagger: STAGGER,
          },
          0,
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const ripple = contextSafe(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dots = gsap.utils.toArray<HTMLElement>(
      "[data-stagger]",
      root.current,
    );
    const wave = gsap.timeline({ overwrite: true });
    wave
      .to(dots, {
        scale: 1.45,
        opacity: 1,
        duration: 0.16,
        stagger: 0.028,
        ease: "power2.out",
      })
      .to(
        dots,
        {
          scale: 1,
          opacity: (_index, element) => restingOpacity(element),
          duration: 0.32,
          stagger: 0.028,
          ease: "power2.out",
        },
        0.08,
      );
  });

  const settle = contextSafe(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dots = gsap.utils.toArray<HTMLElement>(
      "[data-stagger]",
      root.current,
    );
    gsap.to(dots, {
      scale: 1,
      y: 0,
      opacity: (_index, element) => restingOpacity(element),
      duration: 0.2,
      overwrite: true,
      ease: "power2.out",
    });
  });

  return (
    <figure ref={root} className="cs-full">
      <div className="grid grid-cols-1 gap-10 rounded-2xl bg-cs-stat px-6 py-14 sm:grid-cols-2 sm:gap-8 sm:px-12 sm:py-16">
        <Side heading={before.heading} label={before.label} />
        <div
          className="flex flex-col items-center px-2 text-center"
          onPointerEnter={ripple}
          onPointerLeave={settle}
        >
          <p className="text-body text-cs-text">{after.heading}</p>
          <div className="flex h-24 items-center" aria-hidden>
            <div className="flex items-center justify-center gap-1 py-3">
              {Array.from({ length: AFTER_DOTS }, (_, index) => (
                <span
                  key={index}
                  data-stagger
                  data-opacity={opacityAt(index, AFTER_DOTS)}
                  className="size-2.5 shrink-0 rounded-full bg-cs-text"
                />
              ))}
            </div>
          </div>
          <p className="text-body text-cs-faint">{after.label}</p>
        </div>
      </div>
    </figure>
  );
}

function Side({ heading, label }: { heading: string; label: string }) {
  return (
    <div className="flex flex-col items-center px-2 text-center">
      <p className="text-body text-cs-text">{heading}</p>
      <div className="flex h-24 items-center" aria-hidden>
        <span
          data-single
          className="size-2.5 shrink-0 rounded-full bg-cs-text"
        />
      </div>
      <p className="text-body text-cs-faint">{label}</p>
    </div>
  );
}
