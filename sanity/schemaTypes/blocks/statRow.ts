import { InlineIcon } from "@sanity/icons/Inline";
import { defineArrayMember, defineField, defineType } from "sanity";

export const statRow = defineType({
  name: "statRow",
  title: "Stat row",
  type: "object",
  icon: InlineIcon,
  fields: [
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "kicker", type: "string" }),
            defineField({
              name: "value",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(3).max(3),
    }),
    defineField({
      name: "note",
      type: "string",
      description: "Optional footnote under the row.",
    }),
  ],
  preview: {
    select: {
      value0: "items.0.value",
      value1: "items.1.value",
      value2: "items.2.value",
    },
    prepare: ({ value0, value1, value2 }) => ({
      title: [value0, value1, value2].filter(Boolean).join(" · ") || "Stat row",
      subtitle: "Stat row",
    }),
  },
});
