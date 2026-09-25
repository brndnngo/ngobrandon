import Image from "next/image";
import { InsetVideo } from "@/components/case-study/InsetVideo";
import { insetItemStyle } from "@/lib/media-inset";

export type MediaFit = "cover" | "inset";

export function Media({
  src,
  alt,
  videoSrc,
  caption,
  fit = "cover",
  width,
  height,
  priority = false,
}: {
  src: string;
  alt: string;
  videoSrc?: string;
  caption?: string;
  fit?: MediaFit;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  if (!src && !videoSrc) return null;

  const ratio = width && height ? width / height : undefined;

  return (
    <figure data-reveal>
      <div
        className={
          fit === "inset"
            ? "cs-media-inset relative aspect-video overflow-hidden bg-cs-media"
            : "cs-media-frame relative aspect-video overflow-hidden bg-cs-media"
        }
      >
        {fit === "inset" ? (
          videoSrc ? (
            <InsetVideo src={videoSrc} poster={src || undefined} />
          ) : (
            <Image
              src={src}
              alt={alt}
              width={width ?? 1600}
              height={height ?? 900}
              priority={priority}
              sizes="(min-width: 90rem) 768px, 90vw"
              unoptimized={src.includes(".svg")}
              className={
                ratio
                  ? "cs-media-inset-item cs-media-inset-sized"
                  : "cs-media-inset-item"
              }
              style={ratio ? insetItemStyle(ratio) : undefined}
            />
          )
        ) : videoSrc ? (
          <video
            className="absolute top-1/2 left-1/2 h-[calc(100%+4px)] w-[calc(100%+4px)] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-center"
            src={videoSrc}
            poster={src || undefined}
            muted
            autoPlay
            loop
            playsInline
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(min-width: 90rem) 861px, 100vw"
            unoptimized={src.includes(".svg")}
            className="object-cover"
          />
        )}
      </div>
      {caption ? <figcaption className="cs-caption">{caption}</figcaption> : null}
    </figure>
  );
}
