import type { Collaborator } from "@/lib/sanity/types";

export function ProjectHeader({
  title,
  description,
  timeline,
  role,
  collaborators,
}: {
  title: string;
  description: string;
  timeline: string;
  role: string;
  collaborators: Collaborator[];
}) {
  return (
    <header className="cs-span">
      <h1
        data-reveal
        className="cs-title font-display text-cs-title text-cs-text"
      >
        {title}
      </h1>
      <p
        data-reveal
        className="cs-aside text-body text-cs-body max-lg:mt-cs-stack"
      >
        {description}
      </p>
      <dl className="cs-meta max-lg:mt-cs-stack max-lg:grid max-lg:gap-cs-stack">
        <div className="cs-meta-timeline">
          <dt className="text-body text-cs-text">Timeline</dt>
          <dd className="text-body text-cs-body">{timeline}</dd>
        </div>
        <div className="cs-meta-role">
          <dt className="text-body text-cs-text">Role</dt>
          <dd className="text-body text-cs-body">{role}</dd>
        </div>
        {collaborators.length > 0 ? (
          <div className="cs-meta-team">
            <dt className="text-body text-cs-text">Team</dt>
            <dd>
              <ul>
                {collaborators.map((person) => (
                  <li key={person.name} className="flex flex-wrap gap-x-2">
                    <span className="text-body whitespace-nowrap text-cs-body">
                      {person.name}
                    </span>
                    {person.role ? (
                      <span className="text-cs-caption whitespace-nowrap text-cs-body">
                        {person.role}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
      </dl>
    </header>
  );
}
