import { InlineIcon } from "@sanity/icons/Inline";
import { defineField, defineType } from "sanity";

function side(name: "before" | "after", title: string) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({
        name: "heading",
        type: "string",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "label",
        type: "string",
        validation: (rule) => rule.required(),
      }),
    ],
  });
}

export const contrast = defineType({
  name: "contrast",
  title: "Contrast",
  type: "object",
  icon: InlineIcon,
  fields: [side("before", "Before"), side("after", "After")],
  preview: {
    select: { before: "before.heading", after: "after.heading" },
    prepare: ({ before, after }) => ({
      title: [before, after].filter(Boolean).join(" / ") || "Contrast",
      subtitle: "Contrast",
    }),
  },
});
