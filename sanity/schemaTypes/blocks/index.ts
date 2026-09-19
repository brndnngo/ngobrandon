import { defineArrayMember, defineField, defineType } from "sanity";

export const figure = defineType({
  name: "figure",
  title: "Figure",
  type: "object",
  fields: [
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "caption", type: "string" }),
    defineField({
      name: "lightbox",
      type: "boolean",
      initialValue: false,
      description: "Open the image in a lightbox on click.",
    }),
  ],
  preview: {
    select: { title: "alt", media: "image" },
  },
});

export const figureGrid = defineType({
  name: "figureGrid",
  title: "Figure grid",
  type: "object",
  fields: [
    defineField({
      name: "columns",
      type: "number",
      initialValue: 2,
      validation: (rule) => rule.min(2).max(3),
    }),
    defineField({
      name: "figures",
      type: "array",
      of: [defineArrayMember({ type: "figure" })],
      validation: (rule) => rule.min(2),
    }),
  ],
});

export const stats = defineType({
  name: "stats",
  title: "Stats",
  type: "object",
  fields: [
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", type: "string" }),
            defineField({ name: "label", type: "string" }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        }),
      ],
    }),
  ],
});

export const videoBlock = defineType({
  name: "videoBlock",
  title: "Video",
  type: "object",
  fields: [
    defineField({
      name: "src",
      title: "MP4 / WebM URL",
      type: "url",
    }),
    defineField({
      name: "poster",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "caption", type: "string" }),
    defineField({
      name: "autoplay",
      type: "boolean",
      initialValue: true,
    }),
  ],
});

export const steps = defineType({
  name: "steps",
  title: "Steps",
  type: "object",
  fields: [
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "body", type: "text" }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
  ],
});

export const panel = defineType({
  name: "panel",
  title: "Panel",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "body", type: "text" }),
  ],
  preview: { select: { title: "title", subtitle: "eyebrow" } },
});
