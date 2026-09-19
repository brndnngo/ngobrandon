import { Container } from "@/components/layout/Container";
import type { ProjectHero } from "@/lib/sanity/types";

export function Hero({ project }: { project: ProjectHero }) {
  return (
    <section data-nav="light" className="pb-20">
      <Container className="grid gap-12 pt-16 md:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
        <div data-reveal>
          <h1 className="font-display text-display">{project.title}</h1>
          <p className="mt-8 max-w-prose text-body">{project.summary}</p>
        </div>

        <dl data-reveal className="grid content-start gap-8 text-body">
          {project.impact.length > 0 ? (
            <div>
              <dt className="text-eyebrow text-muted uppercase">Impact</dt>
              <dd className="mt-2">
                <ul className="grid gap-2">
                  {project.impact.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}

          <div>
            <dt className="text-eyebrow text-muted uppercase">Timeline</dt>
            <dd className="mt-2">{project.timeline}</dd>
          </div>

          <div>
            <dt className="text-eyebrow text-muted uppercase">Role</dt>
            <dd className="mt-2">{project.role}</dd>
          </div>

          {project.collaborators.length > 0 ? (
            <div>
              <dt className="text-eyebrow text-muted uppercase">
                Collaborators
              </dt>
              <dd className="mt-2">
                <ul className="grid gap-1">
                  {project.collaborators.map((person) => (
                    <li key={person.name}>
                      {person.name}
                      {person.role ? (
                        <span className="text-muted"> — {person.role}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>
      </Container>
    </section>
  );
}
