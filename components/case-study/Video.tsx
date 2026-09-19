export function Video({
  src,
  poster,
  caption,
  autoplay = true,
}: {
  src: string;
  poster?: string;
  caption?: string;
  autoplay?: boolean;
}) {
  return (
    <figure data-reveal className="my-10">
      <video
        src={src}
        poster={poster}
        autoPlay={autoplay}
        muted
        loop
        playsInline
        controls={!autoplay}
        className="h-auto w-full bg-black"
      />
      {caption ? (
        <figcaption className="mt-3 text-eyebrow text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
