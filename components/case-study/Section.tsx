import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-body text-cs-body [&+&]:mt-[length:var(--text-body--line-height)]">
        {children}
      </p>
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
};

export function Section({
  id,
  eyebrow,
  heading,
  body,
}: {
  id: string;
  eyebrow?: string;
  heading: string;
  body: PortableTextBlock[];
}) {
  return (
    <section id={id} className="cs-span scroll-mt-(--nav-height)">
      {eyebrow ? (
        <p className="cs-measure text-body text-cs-faint">{eyebrow}</p>
      ) : null}
      <h2
        data-reveal
        className={`cs-measure font-display text-cs-text ${
          eyebrow ? "mt-2 text-cs-heading" : "text-cs-subhead"
        }`}
      >
        {heading}
      </h2>
      {body.length > 0 ? (
        <div data-reveal className="cs-measure mt-cs-tight">
          <PortableText value={body} components={components} />
        </div>
      ) : null}
    </section>
  );
}
