"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ProjectCard } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/image";

function thumbSrc(card: ProjectCard) {
  if (!card.thumbnail) return null;
  if (typeof card.thumbnail === "string") return card.thumbnail;
  return urlFor(card.thumbnail)?.width(1200).url() ?? null;
}

export function ProjectCardLink({ card }: { card: ProjectCard }) {
  const [hover, setHover] = useState(false);
  const image = thumbSrc(card);

  return (
    <Link
      href={`/project/${card.slug}`}
      className="group grid gap-4"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-(--color-subtle)">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : null}
        {card.preview && hover ? (
          <video
            src={card.preview}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-body">{card.title}</h2>
          <p className="mt-1 text-body text-muted">{card.cardTitle}</p>
        </div>
        <p className="text-eyebrow text-muted">{card.year}</p>
      </div>
    </Link>
  );
}
