"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

export function Lightbox({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children: React.ReactNode;
}) {
  const labelId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="block w-full cursor-zoom-in text-left"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        {children}
      </button>

      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={labelId}
              className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-6"
              onClick={() => setOpen(false)}
            >
              <button
                type="button"
                className="absolute top-6 right-6 text-body text-white"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                id={labelId}
                src={src}
                alt={alt}
                className="max-h-full max-w-full object-contain"
                onClick={(event) => event.stopPropagation()}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
