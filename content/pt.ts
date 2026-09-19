import type { PortableTextBlock } from "@portabletext/react";

let n = 0;
const key = () => `seed${++n}`;

export function block(
  text: string,
  style: "normal" | "h2" | "h3" | "eyebrow" | "blockquote" = "normal",
): PortableTextBlock {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

export function quote(text: string, attribution: string): PortableTextBlock[] {
  return [
    block(text, "blockquote"),
    block(attribution, "eyebrow"),
  ];
}

export function stats(
  items: { value: string; label: string }[],
): Record<string, unknown> {
  return { _type: "stats", _key: key(), items };
}

export function panel(input: {
  eyebrow?: string;
  title?: string;
  body?: string;
}): Record<string, unknown> {
  return { _type: "panel", _key: key(), ...input };
}

export function steps(
  items: { title: string; body: string }[],
): Record<string, unknown> {
  return { _type: "steps", _key: key(), items };
}
