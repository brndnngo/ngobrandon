import type { ReactNode } from "react";
import { CaseStudyBody } from "@/components/portable-text/CaseStudyBody";
import { CaseStudyFooter } from "@/components/case-study/CaseStudyFooter";
import { Media } from "@/components/case-study/Media";
import { MediaGrid } from "@/components/case-study/MediaGrid";
import { ProjectHeader } from "@/components/case-study/ProjectHeader";
import { Quote } from "@/components/case-study/Quote";
import { Section } from "@/components/case-study/Section";
import { SideNav } from "@/components/case-study/SideNav";
import { StatRow } from "@/components/case-study/StatRow";
import {
  tableOfContents,
  type CaseStudyBlock,
  type CaseStudyPage,
  type CaseStudyQuoteBlock,
} from "@/lib/case-study";

function renderBlock(block: CaseStudyBlock) {
  switch (block._type) {
    case "section":
      return (
        <Section
          key={block._key}
          id={block.id}
          eyebrow={block.eyebrow}
          heading={block.heading}
          body={block.body}
        />
      );
    case "mediaBlock":
      return (
        <div key={block._key} className="cs-full">
          <Media
            src={block.media.src}
            alt={block.media.alt}
            videoSrc={block.media.videoSrc}
            caption={block.media.caption}
            fit={block.media.fit}
            padding={block.media.padding}
            stroke={block.media.stroke}
            width={block.media.width}
            height={block.media.height}
          />
        </div>
      );
    case "mediaGrid":
      return (
        <MediaGrid
          key={block._key}
          ratio={block.ratio}
          caption={block.caption}
          items={block.items}
        />
      );
    case "statRow":
      return <StatRow key={block._key} items={block.items} note={block.note} />;
    case "quote":
      return null;
    default:
      return null;
  }
}

function renderBlocks(blocks: CaseStudyBlock[]) {
  const nodes: ReactNode[] = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];
    if (block._type === "quote") {
      const group: CaseStudyQuoteBlock[] = [];
      while (index < blocks.length && blocks[index]._type === "quote") {
        group.push(blocks[index] as CaseStudyQuoteBlock);
        index += 1;
      }
      nodes.push(
        <div key={group[0]._key} className="cs-span cs-quotes flex flex-col gap-8">
          {group.map((quote) => (
            <Quote
              key={quote._key}
              quote={quote.quote}
              attribution={quote.attribution}
            />
          ))}
        </div>,
      );
      continue;
    }

    nodes.push(renderBlock(block));
    index += 1;
  }

  return nodes;
}

export function CaseStudyArticle({ page }: { page: CaseStudyPage }) {
  const toc = tableOfContents(page.blocks);

  return (
    <article data-nav="light">
      <div className="cs-page">
        <SideNav items={toc} />
        <div className="cs-main">
          {page.hero?.src ? (
            <div className="cs-full">
              <Media
                src={page.hero.src}
                alt={page.hero.alt}
                videoSrc={page.hero.videoSrc}
                caption={page.hero.caption}
                fit={page.hero.fit}
                padding={page.hero.padding}
                stroke={page.hero.stroke}
                width={page.hero.width}
                height={page.hero.height}
                priority
              />
            </div>
          ) : null}
          <ProjectHeader
            title={page.title}
            description={page.description}
            timeline={page.timeline}
            role={page.role}
            collaborators={page.collaborators}
          />
          <hr className="cs-full border-0 border-t border-(--color-border)" />
          {renderBlocks(page.blocks)}
          {page.legacyBody?.length ? (
            <div className="cs-full">
              <CaseStudyBody value={page.legacyBody} />
            </div>
          ) : null}
        </div>
      </div>
      <CaseStudyFooter />
    </article>
  );
}
