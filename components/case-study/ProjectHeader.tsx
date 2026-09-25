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
        className="cs-aside text-body text-cs-body max-lg:mt-4"
      >
        {description}
      </p>
      <dl className="cs-meta max-lg:mt-8 max-lg:grid max-lg:gap-4">
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
                  <li key={person.name} className="flex flex-wrap items-baseline gap-x-2">
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
