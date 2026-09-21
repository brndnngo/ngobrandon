import {
  projectColor,
  projectIndexTitle,
} from "@/lib/project-card";
import type { ProjectCard } from "@/lib/sanity/types";

export function ProjectCaption({ card }: { card: ProjectCard }) {
  const title = projectIndexTitle(card);

  return (
    <div className="project-caption">
      <div className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden
          className="size-2 shrink-0"
          style={{ backgroundColor: projectColor(card) }}
        />
        <p className="min-w-0 truncate text-body">{title}</p>
      </div>
      <p className="text-right text-eyebrow">{card.year}</p>
      <p className="min-w-0 text-body text-muted">{card.cardTitle}</p>
      <p className="text-right text-eyebrow text-muted">
        {card.discipline}
      </p>
    </div>
  );
}
