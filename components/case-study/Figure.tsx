import Image from "next/image";
import { Lightbox } from "./Lightbox";

function isSvg(src: string) {
  return src.includes(".svg");
}

export function Figure({
  src,
  alt,
  caption,
  lightbox = false,
  overlay = false,
  className = "my-10",
}: {
  src: string;
  alt: string;
  caption?: string;
  lightbox?: boolean;
  overlay?: boolean;
  className?: string;
}) {
  const onImage = overlay && !isSvg(src);
  const image = (
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={1000}
      unoptimized={isSvg(src)}
      className="h-auto w-full"
    />
  );

  const media = lightbox ? (
    <Lightbox src={src} alt={alt}>
      {image}
    </Lightbox>
  ) : (
    image
  );

  const captionClass = onImage
    ? "pointer-events-none absolute top-3 left-4 z-1 text-body text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]"
    : "mb-2 text-body";

  return (
    <figure data-reveal className={`relative ${className}`.trim()}>
      {caption && !onImage ? (
        <figcaption className={captionClass}>{caption}</figcaption>
      ) : null}
      {media}
      {caption && onImage ? (
        <figcaption className={captionClass}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
