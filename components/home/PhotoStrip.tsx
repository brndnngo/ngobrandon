"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { photos } from "@/components/home/photos";

const LOOP_SECONDS = 50;
const DRAG_GAIN = 1;
const DRAG_THRESHOLD = 8;
const MAX_DT = 0.048;
/**
 * Exponential smoothing: v += (target - v) * (1 - exp(-dt / τ))
 * ~95% settled at 3τ, ~98% at 4τ.
 */
const TAU_DECEL = 0.2;
const TAU_ACCEL = 0.133;
const TAU_BUMP_IN = 0.08;
const TAU_BUMP_OUT = 0.06;
const HOVER_QUERY = "(hover: hover)";
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

type CaptionBox = {
  left: number;
  width: number;
};

type Motion = {
  offset: number;
  vel: number;
  targetVel: number;
  bump: number;
  bumpTarget: number;
  loop: number;
  cruise: number;
  raf: number;
  last: number;
  running: boolean;
};

function mediaMatches(query: string) {
  return window.matchMedia(query).matches;
}

function readToken(el: HTMLElement, name: string, fallback: number) {
  const value = Number.parseFloat(getComputedStyle(el).getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
}

function wrapOffset(x: number, loop: number) {
  if (loop <= 0) return x;
  const wrapped = ((x % loop) + loop) % loop;
  return wrapped === 0 ? 0 : wrapped - loop;
}

function expApproach(current: number, target: number, dt: number, tau: number) {
  return current + (target - current) * (1 - Math.exp(-dt / tau));
}

function expandedRect(rest: DOMRect, scale: number) {
  const width = rest.width * scale;
  const height = rest.height * scale;
  const left = rest.left - (width - rest.width) / 2;
  const top = rest.top - (height - rest.height) / 2;
  return { left, top, width, height, right: left + width, bottom: top + height };
}

function computeBump(rest: DOMRect, scale: number, margin: number, view: DOMRect) {
  const next = expandedRect(rest, scale);
  const min = view.left + margin;
  const max = view.right - margin;
  if (next.left >= min && next.right <= max) return 0;
  if (next.width + margin * 2 >= view.width) {
    return view.left + view.width / 2 - (rest.left + rest.width / 2);
  }
  if (next.left < min) return min - next.left;
  return max - next.right;
}

export function PhotoStrip() {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bumpRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<Motion>({
    offset: 0,
    vel: 0,
    targetVel: 0,
    bump: 0,
    bumpTarget: 0,
    loop: 1,
    cruise: 0,
    raf: 0,
    last: 0,
    running: false,
  });
  const visibleRef = useRef(true);
  const reduceRef = useRef(false);
  const activeRef = useRef<number | null>(null);
  const frameRef = useRef<HTMLElement | null>(null);
  const transitioningRef = useRef(false);
  const draggingRef = useRef(false);
  const didDragRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastT: 0,
    vx: 0,
  });
  const idleTimerRef = useRef(0);
  const lockTimerRef = useRef(0);
  const [active, setActive] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [looping, setLooping] = useState(false);
  const [caption, setCaption] = useState<CaptionBox | null>(null);

  activeRef.current = active;
  const count = photos.length;

  const applyTransform = useCallback(() => {
    const bumpEl = bumpRef.current;
    if (!bumpEl) return;
    const { offset, bump } = motionRef.current;
    bumpEl.style.transform = `translate3d(${offset + bump}px, 0, 0)`;
  }, []);

  const pauseTrack = useCallback(() => {
    motionRef.current.targetVel = 0;
    setPaused(true);
  }, []);

  const resumeTrack = useCallback(() => {
    if (draggingRef.current || reduceRef.current) return;
    motionRef.current.targetVel = motionRef.current.cruise;
    setPaused(false);
  }, []);

  const clearIdle = useCallback(() => {
    window.clearTimeout(idleTimerRef.current);
  }, []);

  const lockFor = useCallback((duration: number) => {
    transitioningRef.current = duration > 0;
    window.clearTimeout(lockTimerRef.current);
    if (duration <= 0) return;
    lockTimerRef.current = window.setTimeout(() => {
      transitioningRef.current = false;
    }, duration);
  }, []);

  const deactivate = useCallback(() => {
    clearIdle();
    lockFor(mediaMatches(REDUCE_QUERY) ? 0 : 180);
    activeRef.current = null;
    frameRef.current = null;
    motionRef.current.bumpTarget = 0;
    setActive(null);
    setCaption(null);
    if (!draggingRef.current) resumeTrack();
  }, [clearIdle, lockFor, resumeTrack]);

  const activate = useCallback(
    (index: number, frame: HTMLElement) => {
      if (draggingRef.current || didDragRef.current) return;
      if (activeRef.current === index) return;
      const root = rootRef.current;
      const viewport = viewportRef.current;
      if (!root || !viewport) return;

      pauseTrack();
      activeRef.current = index;
      frameRef.current = frame;
      setActive(index);

      if (mediaMatches(REDUCE_QUERY)) {
        const rest = frame.getBoundingClientRect();
        const origin = root.getBoundingClientRect();
        setCaption({ left: rest.left - origin.left, width: rest.width });
        motionRef.current.bumpTarget = 0;
        return;
      }

      const scale = readToken(root, "--photo-scale", 1.8);
      const margin = readToken(root, "--photo-bump-margin", 24);
      const rest = frame.getBoundingClientRect();
      const view = viewport.getBoundingClientRect();
      const nextBump = computeBump(rest, scale, margin, view);
      const expanded = expandedRect(rest, scale);
      const origin = root.getBoundingClientRect();
      const motion = motionRef.current;

      lockFor(240);
      motion.bumpTarget = motion.bump + nextBump;
      const pad = margin;
      let left = expanded.left - origin.left + nextBump;
      let width = expanded.width;
      const minLeft = pad;
      const maxRight = origin.width - pad;
      if (left < minLeft) {
        width -= minLeft - left;
        left = minLeft;
      }
      if (left + width > maxRight) {
        width = Math.max(0, maxRight - left);
      }
      setCaption({ left, width });
    },
    [lockFor, pauseTrack],
  );

  const deactivateRef = useRef(deactivate);
  deactivateRef.current = deactivate;

  const pointInActive = useCallback((x: number, y: number) => {
    const root = rootRef.current;
    const frame = frameRef.current;
    if (!root || !frame || activeRef.current === null) return false;
    const scale = mediaMatches(REDUCE_QUERY)
      ? 1
      : readToken(root, "--photo-scale", 1.8);
    const box = expandedRect(frame.getBoundingClientRect(), scale);
    return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
  }, []);

  useEffect(() => {
    const bumpEl = bumpRef.current;
    const track = trackRef.current;
    if (!bumpEl || !track) return;

    const motion = motionRef.current;

    const measure = () => {
      motion.loop = Math.max(track.scrollWidth / 2, 1);
      motion.cruise = looping ? -motion.loop / LOOP_SECONDS : 0;
      if (motion.targetVel !== 0) motion.targetVel = motion.cruise;
    };

    const tick = (now: number) => {
      if (!motion.running) return;
      const dt = Math.min((now - motion.last) / 1000, MAX_DT);
      motion.last = now;

      if (!draggingRef.current) {
        const slowing = Math.abs(motion.targetVel) < Math.abs(motion.vel);
        const tau = slowing ? TAU_DECEL : TAU_ACCEL;
        motion.vel = expApproach(motion.vel, motion.targetVel, dt, tau);
        motion.offset += motion.vel * dt;
      }

      const bumpTau =
        motion.bumpTarget === 0 ||
        Math.abs(motion.bumpTarget) < Math.abs(motion.bump)
          ? TAU_BUMP_OUT
          : TAU_BUMP_IN;
      motion.bump = expApproach(motion.bump, motion.bumpTarget, dt, bumpTau);
      motion.offset = wrapOffset(motion.offset, motion.loop);
      applyTransform();
      motion.raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (motion.running || reduceRef.current || !visibleRef.current || !looping) {
        return;
      }
      motion.running = true;
      motion.last = performance.now();
      motion.raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      motion.running = false;
      cancelAnimationFrame(motion.raf);
    };

    measure();
    if (looping && activeRef.current === null && motion.targetVel === 0) {
      motion.targetVel = motion.cruise;
    }

    const resize = new ResizeObserver(() => {
      measure();
      motion.offset = wrapOffset(motion.offset, motion.loop);
      applyTransform();
    });
    resize.observe(track);

    const root = rootRef.current;
    const scroller = root?.closest(".home-snap");
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = Boolean(entry?.isIntersecting);
        if (visibleRef.current) start();
        else {
          stop();
          deactivateRef.current();
        }
      },
      { root: scroller instanceof Element ? scroller : null, threshold: 0.2 },
    );
    if (root) io.observe(root);

    start();

    return () => {
      stop();
      resize.disconnect();
      io.disconnect();
    };
  }, [applyTransform, looping]);

  useEffect(() => {
    const reduce = mediaMatches(REDUCE_QUERY);
    reduceRef.current = reduce;
    setLooping(!reduce);
    const mq = window.matchMedia(REDUCE_QUERY);
    const onChange = () => {
      reduceRef.current = mq.matches;
      setLooping(!mq.matches);
      if (mq.matches) {
        const motion = motionRef.current;
        motion.vel = 0;
        motion.targetVel = 0;
        motion.bump = 0;
        motion.bumpTarget = 0;
        applyTransform();
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [applyTransform]);

  useEffect(
    () => () => {
      clearIdle();
      window.clearTimeout(lockTimerRef.current);
    },
    [clearIdle],
  );

  const isDesktop = () => mediaMatches(HOVER_QUERY);
  const isReduce = () => mediaMatches(REDUCE_QUERY);

  const onStripPointerOver = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerRef.current = { x: event.clientX, y: event.clientY };
    if (!isDesktop() || isReduce() || draggingRef.current) return;
    const frame = (event.target as Element).closest<HTMLElement>(
      "[data-photo-index]",
    );
    if (!frame) return;
    const index = Number(frame.dataset.photoIndex);
    if (!Number.isFinite(index)) return;
    if (transitioningRef.current) return;
    if (activeRef.current === index) return;
    if (activeRef.current !== null && pointInActive(event.clientX, event.clientY)) {
      return;
    }
    activate(index, frame);
  };

  const onStripPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerRef.current = { x: event.clientX, y: event.clientY };
    if (draggingRef.current) return;
    if (!isDesktop() || isReduce() || transitioningRef.current) return;
    if (activeRef.current === null) return;
    if (pointInActive(event.clientX, event.clientY)) return;
    const frame = (event.target as Element).closest<HTMLElement>(
      "[data-photo-index]",
    );
    if (frame) {
      const next = Number(frame.dataset.photoIndex);
      if (Number.isFinite(next) && next !== activeRef.current) {
        activate(next, frame);
      }
      return;
    }
    deactivate();
  };

  const onStripPointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) return;
    if (!isDesktop()) return;
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    if (activeRef.current !== null) deactivate();
    else resumeTrack();
  };

  const onViewportPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || isReduce()) return;
    didDragRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastT: event.timeStamp,
      vx: 0,
    };
  };

  const onViewportPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.lastX;
    const dt = Math.max(event.timeStamp - drag.lastT, 1);
    if (!draggingRef.current) {
      const totalX = event.clientX - drag.startX;
      const totalY = event.clientY - drag.startY;
      if (
        Math.abs(totalX) < DRAG_THRESHOLD ||
        Math.abs(totalX) < Math.abs(totalY)
      ) {
        return;
      }
      draggingRef.current = true;
      didDragRef.current = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
      deactivate();
      pauseTrack();
    }
    const seconds = dt / 1000;
    drag.vx = seconds > 0 ? (dx * DRAG_GAIN) / seconds : 0;
    drag.lastX = event.clientX;
    drag.lastT = event.timeStamp;
    const motion = motionRef.current;
    motion.offset += dx * DRAG_GAIN;
    motion.vel = drag.vx;
    motion.offset = wrapOffset(motion.offset, motion.loop);
    applyTransform();
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;
    drag.pointerId = -1;
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const el = document.elementFromPoint(event.clientX, event.clientY);
    const frame = el instanceof Element ? el.closest("[data-photo-index]") : null;
    motionRef.current.vel = drag.vx;
    if (frame && isDesktop() && !isReduce()) pauseTrack();
    else resumeTrack();
    window.setTimeout(() => {
      didDragRef.current = false;
    }, 0);
  };

  const copies = looping ? 2 : 1;
  const activePhoto =
    active === null ? null : photos[((active % count) + count) % count];
  const captionVisible = Boolean(activePhoto && caption);

  return (
    <div
      ref={rootRef}
      className="photo-strip"
      data-active={active !== null ? "" : undefined}
      data-paused={paused ? "" : undefined}
      data-dragging={dragging ? "" : undefined}
      data-loop={looping ? "" : undefined}
      onPointerOver={onStripPointerOver}
      onPointerMove={onStripPointerMove}
      onPointerLeave={onStripPointerLeave}
    >
      <div
        ref={viewportRef}
        className="photo-strip-viewport"
        onPointerDown={onViewportPointerDown}
        onPointerMove={onViewportPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="photo-strip-stage">
          <div ref={bumpRef} className="photo-strip-bump">
            <div ref={trackRef} className="photo-strip-track">
              {Array.from({ length: copies }, (_, copy) => (
                <div
                  key={copy}
                  className="photo-strip-set"
                  {...(copy > 0 ? { inert: true, "aria-hidden": true } : {})}
                >
                  {photos.map((photo, photoIndex) => {
                    const index = copy * count + photoIndex;
                    const isActive = active === index;
                    return (
                      <div
                        key={`${copy}-${photo.src}`}
                        data-photo-index={index}
                        className={`photo-strip-frame${isActive ? " is-active" : ""}`}
                      >
                        <span className="photo-strip-visual">
                          <Image
                            src={photo.src}
                            alt=""
                            width={720}
                            height={480}
                            sizes="280px"
                            loading="lazy"
                            draggable={false}
                            className="h-full w-full object-cover"
                          />
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="photo-strip-caption-slot" aria-hidden={!captionVisible}>
        <div
          className="photo-strip-caption"
          style={{
            left: caption?.left ?? 0,
            width: caption?.width ?? 0,
            opacity: captionVisible ? 1 : 0,
          }}
        >
          {activePhoto ? (
            <>
              <p className="text-body">{activePhoto.title}</p>
              <p className="text-right text-eyebrow text-muted">
                {activePhoto.year}
              </p>
              <p className="text-eyebrow text-muted">{activePhoto.location}</p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
