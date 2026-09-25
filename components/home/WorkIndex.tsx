"use client";

import Link from "next/link";
import { useState } from "react";
import { ProjectCaption } from "@/components/home/ProjectCaption";
import { ProjectMedia } from "@/components/home/ProjectMedia";
import {
  projectColor,
  projectHref,
  projectIndexTitle,
  projectIsExternal,
} from "@/lib/project-card";
import type { ProjectCard } from "@/lib/sanity/types";

function projectLinkProps(card: ProjectCard) {
  const href = projectHref(card);
  if (projectIsExternal(card)) {
    return { href, target: "_blank" as const, rel: "noreferrer" };
  }
  return { href };
}

export function WorkIndex({ projects }: { projects: ProjectCard[] }) {
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug ?? "");
  const active =
    projects.find((project) => project.slug === activeSlug) ?? projects[0];

  if (!active) return null;

  return (
    <div className="work-index">
      <div className="work-index-split page-grid min-h-0 flex-1 pb-8">
        <nav className="page-grid-left" aria-label="Selected work">
          <ul className="flex flex-col gap-(--spacing-work-index)">
            {projects.map((card) => {
              const isActive = card.slug === active.slug;
              const title = projectIndexTitle(card);

              return (
                <li key={card.slug}>
                  <Link
                    {...projectLinkProps(card)}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={
                      card.gated ? `${title}, password protected` : title
                    }
                    onMouseOver={() => setActiveSlug(card.slug)}
                    onFocus={() => setActiveSlug(card.slug)}
                    className={`grid grid-cols-[0.5rem_auto] items-center gap-x-3 font-display text-title outline-none ${
                      isActive
                        ? "text-foreground"
                        : "text-muted hover:text-foreground focus-visible:text-foreground"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="size-2"
                      style={{
                        backgroundColor: isActive
                          ? projectColor(card)
                          : "transparent",
                      }}
                    />
                    <span>{title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="page-grid-right min-w-0">
          <Link
            {...projectLinkProps(active)}
            tabIndex={-1}
            className="work-index-preview-link outline-none"
            aria-label={
              active.gated
                ? `${projectIndexTitle(active)}, password protected`
                : projectIndexTitle(active)
            }
          >
            <div className="work-index-preview">
              <ProjectMedia card={active} hoverVideo playing />
            </div>
            <ProjectCaption card={active} />
          </Link>
        </div>
      </div>

      <ul className="work-index-stack page-grid gap-y-6 md:pb-8">
        {projects.map((card) => (
          <li key={card.slug} className="col-span-full">
            <Link
              {...projectLinkProps(card)}
              className="grid outline-none"
              aria-label={
                card.gated
                  ? `${projectIndexTitle(card)}, password protected`
                  : projectIndexTitle(card)
              }
            >
              <ProjectMedia card={card} />
              <ProjectCaption card={card} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
