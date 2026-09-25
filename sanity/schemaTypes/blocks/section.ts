import { BlockContentIcon } from "@sanity/icons/BlockContent";
import { defineArrayMember, defineField, defineType } from "sanity";

export const caseStudySection = defineType({
  name: "section",
  title: "Section",
  type: "object",
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      description: "Top-level sections only. Leave empty to nest under the previous section in the side nav.",
    }),
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) =>
        rule.custom((heading, context) => {
          const body = (context.parent as { body?: unknown[] } | undefined)?.body;
          if (typeof heading === "string" && heading.trim()) return true;
          if (Array.isArray(body) && body.length > 0) return true;
          return "Add a heading or body text";
        }),
    }),
    defineField({
      name: "tocLabel",
      type: "string",
      title: "Nav label",
      description: "Shorter side-nav label. Defaults to the eyebrow, then the heading.",
    }),
    defineField({
      name: "includeInToc",
      type: "boolean",
      title: "Show in side nav",
      initialValue: true,
    }),
    defineField({
      name: "body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    validation: (rule) =>
                      rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto"],
                      }),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { eyebrow: "eyebrow", heading: "heading", tocLabel: "tocLabel" },
    prepare: ({ eyebrow, heading, tocLabel }) => ({
      title: heading || "Section",
      subtitle: tocLabel || eyebrow || "Section",
    }),
  },
});
