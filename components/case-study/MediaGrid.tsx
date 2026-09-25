import Image from "next/image";
import { InsetVideo } from "@/components/case-study/InsetVideo";
import {
  insetItemStyle,
  insetPaddingStyle,
  type MediaPadding,
} from "@/lib/media-inset";

export type MediaGridRatio = "1:1" | "16:9";

export type MediaGridItem = {
  src: string;
  alt: string;
  videoSrc?: string;
  caption?: string;
  fit?: "cover" | "inset";
  padding?: MediaPadding;
  stroke?: boolean;
  width?: number;
  height?: number;
};

function GridFrame({
  item,
  ratio,
}: {
  item: MediaGridItem;
  ratio: MediaGridRatio;
}) {
  const aspect = ratio === "1:1" ? "aspect-square" : "aspect-video";
  const inset = item.fit === "inset";
  const imageRatio =
    item.width && item.height ? item.width / item.height : undefined;

  return (
    <figure>
      <div
        className={[
          inset
            ? "cs-media-inset relative overflow-hidden bg-cs-media"
            : `relative overflow-hidden bg-cs-media ${aspect}`,
          item.stroke ? "cs-media-stroke" : "",
        ].join(" ")}
        style={inset ? insetPaddingStyle(item.padding) : undefined}
      >
        {inset ? (
          item.videoSrc ? (
            <InsetVideo
              src={item.videoSrc}
              poster={item.src || undefined}
              padding={item.padding}
            />
          ) : (
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width ?? 1600}
              height={item.height ?? 900}
              sizes="(min-width: 64rem) 30vw, 100vw"
              unoptimized={item.src.includes(".svg")}
              className="cs-media-inset-item cs-media-inset-sized"
              style={insetItemStyle(imageRatio, item.padding)}
            />
          )
        ) : item.videoSrc ? (
          <video
            className="h-full w-full object-cover"
            src={item.videoSrc}
            poster={item.src || undefined}
            muted
            autoPlay
            loop
            playsInline
          />
        ) : (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(min-width: 64rem) 30vw, 100vw"
            unoptimized={item.src.includes(".svg")}
            className="object-cover"
          />
        )}
      </div>
      {item.caption ? (
        <figcaption className="cs-caption">{item.caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function MediaGrid({
  items,
  ratio = "1:1",
  caption,
}: {
  items: MediaGridItem[];
  ratio?: MediaGridRatio;
  caption?: string;
}) {
  const frames = items.filter((item) => item.src || item.videoSrc);
  if (!frames.length) return null;

  const columns =
    frames.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <figure data-reveal className="cs-full">
      <div className={`grid grid-cols-1 gap-cs-stack ${columns}`}>
        {frames.map((item) => (
          <GridFrame key={`${item.src}-${item.alt}`} item={item} ratio={ratio} />
        ))}
      </div>
      {caption ? <figcaption className="cs-caption">{caption}</figcaption> : null}
    </figure>
  );
}
