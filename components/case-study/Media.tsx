import Image from "next/image";
import { InsetVideo } from "@/components/case-study/InsetVideo";
import {
  insetItemStyle,
  insetPaddingStyle,
  type MediaPadding,
} from "@/lib/media-inset";

export type MediaFit = "cover" | "inset";

export function Media({
  src,
  alt,
  videoSrc,
  caption,
  fit = "cover",
  padding,
  stroke = false,
  width,
  height,
  priority = false,
}: {
  src: string;
  alt: string;
  videoSrc?: string;
  caption?: string;
  fit?: MediaFit;
  padding?: MediaPadding;
  stroke?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  if (!src && !videoSrc) return null;

  const ratio = width && height ? width / height : undefined;
  const inset = fit === "inset";

  return (
    <figure data-reveal>
      <div
        className={[
          inset
            ? "cs-media-inset relative overflow-hidden bg-cs-media"
            : "cs-media-frame relative aspect-video overflow-hidden bg-cs-media",
          stroke ? "cs-media-stroke" : "",
        ].join(" ")}
        style={inset ? insetPaddingStyle(padding) : undefined}
      >
        {inset ? (
          videoSrc ? (
            <InsetVideo
              src={videoSrc}
              poster={src || undefined}
              padding={padding}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              width={width ?? 1600}
              height={height ?? 900}
              priority={priority}
              sizes="(min-width: 90rem) 768px, 90vw"
              unoptimized={src.includes(".svg")}
              className="cs-media-inset-item cs-media-inset-sized"
              style={insetItemStyle(ratio, padding)}
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
