import Image from "next/image";

export type MediaGridRatio = "1:1" | "16:9";

export type MediaGridItem = {
  src: string;
  alt: string;
  videoSrc?: string;
  caption?: string;
};

function GridFrame({
  item,
  ratio,
}: {
  item: MediaGridItem;
  ratio: MediaGridRatio;
}) {
  const aspect = ratio === "1:1" ? "aspect-square" : "aspect-video";
  const frameClass = "h-full w-full object-cover";

  return (
    <figure>
      <div className={`relative overflow-hidden bg-cs-media ${aspect}`}>
        {item.videoSrc ? (
          <video
            className={frameClass}
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
            className={frameClass}
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
