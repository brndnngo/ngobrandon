"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site";

function CheckMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="14"
      height="14"
      className="ml-1 inline-block align-[-2px] text-foreground"
    >
      <path
        d="M3 8.5 6.5 12 13 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CopyEmailButton({
  variant = "card",
}: {
  variant?: "card" | "plain";
}) {
  const [copied, setCopied] = useState(false);
  const emailRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<number>(0);

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
    } catch {
      const node = emailRef.current;
      const selection = window.getSelection();
      if (!node || !selection) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }

    setCopied(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
  }

  const copiedLabel = (
    <>
      Copied, talk soon
      <CheckMark />
    </>
  );

  const idleLabel = (
    <>
      Find some time together{" "}
      <span aria-hidden className="text-foreground">
        ↓
      </span>
    </>
  );

  if (variant === "plain") {
    const plainIdle = (
      <>
        Find some time together{" "}
        <span aria-hidden>↓</span>
      </>
    );

    return (
      <button
        type="button"
        onClick={copyEmail}
        aria-label="Copy email address"
        className="cursor-pointer text-left"
      >
        <span
          className={`block whitespace-nowrap font-medium text-eyebrow ${
            copied ? "text-foreground" : "text-muted"
          }`}
        >
          {copied ? copiedLabel : plainIdle}
        </span>
        <span
          ref={emailRef}
          className={`mt-1 block text-body ${copied ? "text-foreground" : ""}`}
        >
          {siteConfig.email}
        </span>
        <span className="sr-only" aria-live="polite">
          {copied ? "Email copied" : ""}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copyEmail}
      aria-label="Copy email address"
      className={`group z-[999] mt-6 w-full cursor-pointer rounded-[4px] border bg-transparent px-(--spacing-footer-card-x) py-(--spacing-footer-card-y) text-center text-body backdrop-blur-[5px] transition-colors lg:absolute lg:top-0 lg:right-[calc(var(--spacing-page)-var(--page-rail))] lg:mt-0 lg:w-[calc(var(--page-rail)-2*var(--spacing-page))] lg:text-left ${
        copied
          ? "border-foreground"
          : "border-(--color-border) hover:border-foreground"
      }`}
    >
      <span className="block whitespace-nowrap">
        {copied ? copiedLabel : idleLabel}
      </span>
      <span
        ref={emailRef}
        className={`block overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,black_calc(100%-1rem),transparent)] transition-colors ${
          copied
            ? "text-foreground"
            : "text-muted group-hover:text-foreground"
        }`}
      >
        {siteConfig.email}
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email copied" : ""}
      </span>
    </button>
  );
}
