import Image from "next/image";
import { projectMedia } from "@/lib/project-card";
import type { ProjectCard } from "@/lib/sanity/types";

export function ProjectMedia({
  card,
  className = "",
}: {
  card: ProjectCard;
  className?: string;
}) {
  const media = projectMedia(card);

  return (
    <div
      className={`project-media relative aspect-video w-full overflow-hidden rounded-lg bg-subtle ${className}`.trim()}
    >
      {media?.type === "image" ? (
        <Image
          src={media.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      ) : null}
      {media?.type === "video" ? (
        <video
          src={media.src}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </div>
  );
}
