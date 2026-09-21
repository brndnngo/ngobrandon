import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cardTitle",
      title: "Homepage card title",
      type: "string",
      description: "Short line under the name on the homepage card.",
    }),
    defineField({
      name: "indexTitle",
      title: "Index title",
      type: "string",
      description:
        "Name shown on the homepage work index when it should differ from the case-study title.",
    }),
    defineField({
      name: "discipline",
      type: "string",
      description: "Right-hand caption line on the homepage work index.",
    }),
    defineField({
      name: "color",
      title: "Index marker color",
      type: "string",
      description: "Hex value for the 8×8 project marker on the work index.",
    }),
    defineField({
      name: "href",
      title: "External URL",
      type: "url",
      description:
        "If set, the work index links out instead of opening a case study.",
    }),
    defineField({
      name: "year",
      type: "string",
    }),
    defineField({
      name: "impact",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "timeline", type: "string" }),
    defineField({ name: "role", type: "string" }),
    defineField({
      name: "collaborators",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", type: "string" }),
            defineField({ name: "role", type: "string" }),
          ],
          preview: {
            select: { title: "name", subtitle: "role" },
          },
        }),
      ],
    }),
    defineField({
      name: "thumbnail",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "preview",
      title: "Hover preview",
      type: "url",
      description: "Optional looping video shown on homepage card hover.",
    }),
    defineField({
      name: "gated",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "selected",
      title: "Selected project",
      type: "boolean",
      description:
        "Show this project in the command palette before the user types a search.",
      initialValue: false,
    }),
    defineField({
      name: "order",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Eyebrow", value: "eyebrow" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    validation: (rule) =>
                      rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({ type: "figure" }),
        defineArrayMember({ type: "figureGrid" }),
        defineArrayMember({ type: "stats" }),
        defineArrayMember({ type: "videoBlock" }),
        defineArrayMember({ type: "steps" }),
        defineArrayMember({ type: "panel" }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "year", media: "thumbnail" },
  },
});
