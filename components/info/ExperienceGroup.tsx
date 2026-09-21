import type { ExperienceGroup as ExperienceGroupData } from "@/content/info";
import { ExperienceRow } from "@/components/info/ExperienceRow";

export function ExperienceGroup({
  group,
}: {
  group: ExperienceGroupData;
}) {
  return (
    <div className="page-grid items-start gap-y-4">
      <h2 className="page-grid-info-label text-body">{group.label}</h2>
      <ul className="page-grid-info-list flex flex-col gap-4">
        {group.items.map((item, index) => (
          <ExperienceRow
            key={item.name}
            item={item}
            showDivider={index < group.items.length - 1}
          />
        ))}
      </ul>
    </div>
  );
}
