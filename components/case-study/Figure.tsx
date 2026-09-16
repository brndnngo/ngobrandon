import Image from "next/image";
import { Lightbox } from "./Lightbox";

export function Figure({
  src,
  alt,
  caption,
  lightbox = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  lightbox?: boolean;
}) {
  const image = (
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={1000}
      className="h-auto w-full bg-(--color-subtle)"
    />
  );

  return (
    <figure data-reveal className="my-10">
      {lightbox ? (
        <Lightbox src={src} alt={alt}>
          {image}
        </Lightbox>
      ) : (
        image
      )}
      {caption ? (
        <figcaption className="mt-3 text-eyebrow text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
