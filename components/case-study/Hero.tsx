import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import type { ProjectHero } from "@/lib/sanity/types";

function heroSrc(project: ProjectHero) {
  const source = project.heroImage ?? project.thumbnail;
  if (!source) return null;
  if (typeof source === "string") {
    return { src: source, alt: project.heroAlt || project.title };
  }
  const src = urlFor(source)?.width(2400).url();
  if (!src) return null;
  return { src, alt: project.heroAlt || project.title };
}

function MetaLabel({ children }: { children: string }) {
  return (
    <dt className="mb-1 text-[12px] leading-4 text-[#777]">{children}</dt>
  );
}

export function Hero({ project }: { project: ProjectHero }) {
  const hero = heroSrc(project);

  return (
    <section data-nav="light">
      <header className="pt-8">
        <h1 data-reveal className="mb-6 font-display text-display">
          {project.title}
        </h1>

        <div className="mb-10 grid gap-10 md:grid-cols-[minmax(0,1.93fr)_minmax(12rem,1fr)] md:gap-20">
          <div data-reveal>
            <p className="max-w-[58.3rem] text-body">{project.summary}</p>

            {project.impact.length > 0 ? (
              <div className="mt-6">
                <p className="mb-1 text-[12px] leading-4 text-[#777]">IMPACT</p>
                <ul className="grid max-w-[35.125rem] text-body">
                  {project.impact.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <dl data-reveal className="grid content-start gap-6 text-body">
            <div>
              <MetaLabel>TIMELINE</MetaLabel>
              <dd>{project.timeline}</dd>
            </div>

            <div>
              <MetaLabel>ROLE</MetaLabel>
              <dd>{project.role}</dd>
            </div>

            {project.collaborators.length > 0 ? (
              <div>
                <MetaLabel>COLLABORATORS</MetaLabel>
                <dd>
                  <ul>
                    {project.collaborators.map((person) => (
                      <li key={person.name}>
                        <span className="block">{person.name}</span>
                        {person.role ? (
                          <span className="block">{person.role}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </header>

      {hero ? (
        <div data-reveal className="case-study-bleed">
          <Image
            src={hero.src}
            alt={hero.alt}
            width={2400}
            height={1000}
            priority
            unoptimized={hero.src.includes(".svg")}
            className="h-auto w-full"
          />
        </div>
      ) : null}
    </section>
  );
}
