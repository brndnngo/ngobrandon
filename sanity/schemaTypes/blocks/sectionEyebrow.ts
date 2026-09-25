import { StringIcon } from "@sanity/icons/String";
import { defineField, defineType } from "sanity";

export const sectionEyebrow = defineType({
  name: "sectionEyebrow",
  title: "Section eyebrow",
  type: "object",
  icon: StringIcon,
  fields: [
    defineField({
      name: "text",
      type: "string",
      description: "Small uppercase label, e.g. OVERVIEW.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "text" },
    prepare: ({ title }) => ({
      title: title ?? "Section eyebrow",
      subtitle: "Eyebrow",
    }),
  },
});
