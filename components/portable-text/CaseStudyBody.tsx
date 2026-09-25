import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { Figure } from "@/components/case-study/Figure";
import { FigureGrid } from "@/components/case-study/FigureGrid";
import { ImageRow } from "@/components/case-study/ImageRow";
import { Panel } from "@/components/case-study/Panel";
import { Stats } from "@/components/case-study/Stats";
import { Steps } from "@/components/case-study/Steps";
import { Video } from "@/components/case-study/Video";
import { urlFor } from "@/lib/sanity/image";

function imageSrc(source: SanityImageSource | string | undefined | null) {
  if (!source) return "";
  if (typeof source === "string") return source;
  return urlFor(source)?.width(1600).url() ?? "";
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p data-reveal className="mt-2 max-w-[74.8125rem] text-body">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        data-reveal
        className="mt-10 font-sans text-cs-heading [.case-study-eyebrow+&]:mt-0"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        data-reveal
        className="mt-5 mb-1 font-sans text-cs-subhead"
      >
        {children}
      </h3>
    ),
    eyebrow: ({ children }) => (
      <p className="mb-2 text-[12px] leading-4 text-[#777]">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote
        data-reveal
        className="my-10 max-w-[74.8125rem] border-l border-(--color-border) pl-6 text-body"
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="max-w-[74.8125rem] list-disc py-3 pl-5 text-body">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="max-w-[74.8125rem] list-decimal py-3 pl-5 text-body">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="underline underline-offset-4"
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  },
  types: {
    sectionEyebrow: ({ value }) =>
      value?.text ? (
        <p className="case-study-eyebrow mt-20 mb-2 text-[12px] leading-4 text-[#777]">
          {value.text}
        </p>
      ) : null,
    captionedImage: ({ value }) => {
      const src = imageSrc(value.image);
      if (!src) return null;
      return (
        <Figure
          src={src}
          alt={value.alt ?? ""}
          caption={value.caption}
          overlay
        />
      );
    },
    imageRow: ({ value }) => (
      <ImageRow
        figures={(value.images ?? [])
          .map(
            (figure: {
              image?: SanityImageSource;
              alt?: string;
              caption?: string;
              _key?: string;
            }) => ({
              src: imageSrc(figure.image),
              alt: figure.alt ?? "",
              caption: figure.caption,
            }),
          )
          .filter((figure: { src: string }) => figure.src)}
      />
    ),
    figure: ({ value }) => {
      const src = imageSrc(value.image ?? value.src);
      if (!src) return null;
      return (
        <Figure
          src={src}
          alt={value.alt ?? ""}
          caption={value.caption}
          lightbox={Boolean(value.lightbox)}
        />
      );
    },
    figureGrid: ({ value }) => (
      <FigureGrid
        columns={value.columns ?? 2}
        figures={(value.figures ?? [])
          .map(
            (figure: {
              image?: SanityImageSource;
              src?: string;
              alt?: string;
              caption?: string;
              lightbox?: boolean;
            }) => ({
              src: imageSrc(figure.image ?? figure.src),
              alt: figure.alt ?? "",
              caption: figure.caption,
              lightbox: Boolean(figure.lightbox),
            }),
          )
          .filter((figure: { src: string }) => figure.src)}
      />
    ),
    stats: ({ value }) => <Stats items={value.items ?? []} />,
    videoBlock: ({ value }) =>
      value.src ? (
        <Video
          src={value.src}
          poster={imageSrc(value.poster) || undefined}
          caption={value.caption}
          autoplay={value.autoplay !== false}
        />
      ) : null,
    steps: ({ value }) => <Steps items={value.items ?? []} />,
    panel: ({ value }) => (
      <Panel eyebrow={value.eyebrow} title={value.title} body={value.body} />
    ),
  },
};

export function CaseStudyBody({ value }: { value: unknown[] }) {
  if (!value?.length) return null;
  return (
    <div className="pb-24">
      <PortableText
        value={value as PortableTextBlock[]}
        components={components}
      />
    </div>
  );
}
