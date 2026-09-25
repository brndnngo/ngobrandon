import { Fragment } from "react";
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

function HeadingText({ heading }: { heading: string }) {
  const lines = heading.split("\n");
  if (lines.length === 1) return heading;

  return lines.map((line, index) => (
    <Fragment key={index}>
      {index > 0 ? <br /> : null}
      {line.trimEnd().endsWith(":") ? (
        <span className="text-cs-faint">{line}</span>
      ) : (
        line
      )}
    </Fragment>
  ));
}

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
  const hasHeading = heading.trim().length > 0;

  return (
    <section id={id} className="cs-span scroll-mt-(--nav-height)">
      {eyebrow ? (
        <p className="cs-measure text-body text-cs-faint">{eyebrow}</p>
      ) : null}
      {hasHeading ? (
        <h2
          data-reveal
          className={`cs-measure font-display text-cs-text ${
            eyebrow ? "mt-2 text-cs-heading" : "text-cs-subhead"
          }`}
        >
          <HeadingText heading={heading} />
        </h2>
      ) : null}
      {body.length > 0 ? (
        <div
          data-reveal
          className={`cs-measure${hasHeading ? " mt-cs-tight" : ""}`}
        >
          <PortableText value={body} components={components} />
        </div>
      ) : null}
    </section>
  );
}
