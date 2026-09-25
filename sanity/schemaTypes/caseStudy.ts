import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { createElement } from "react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { HEX_COLOR, MONTHS, imageFieldOptions } from "./image";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "header", title: "Header", default: true },
    { name: "workIndex", title: "Work index" },
    { name: "body", title: "Body" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "header",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "header",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 4,
      group: "header",
      description: "Opening paragraph beside the title.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "timeline",
      type: "object",
      group: "header",
      description: "Leave the end blank if the work is ongoing.",
      fields: [
        defineField({
          name: "startMonth",
          type: "string",
          options: { list: [...MONTHS] },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "startYear",
          type: "number",
          validation: (rule) => rule.required().integer().min(1990).max(2100),
        }),
        defineField({
          name: "endMonth",
          type: "string",
          options: { list: [...MONTHS] },
        }),
        defineField({
          name: "endYear",
          type: "number",
          validation: (rule) => rule.integer().min(1990).max(2100),
        }),
      ],
      validation: (rule) =>
        rule.required().custom((timeline) => {
          if (!timeline || typeof timeline !== "object") return true;
          const { endMonth, endYear } = timeline as {
            endMonth?: string;
            endYear?: number;
          };
          const hasEndMonth = Boolean(endMonth);
          const hasEndYear = endYear !== undefined && endYear !== null;
          if (hasEndMonth !== hasEndYear) {
            return "Set both end month and end year, or leave both empty for ongoing work.";
          }
          return true;
        }),
    }),
    defineField({
      name: "role",
      type: "string",
      group: "header",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "collaborators",
      type: "array",
      group: "header",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              type: "string",
              description: "Job title, e.g. CEO.",
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "title" },
          },
        }),
      ],
    }),
    defineField({
      name: "hero",
      type: "media",
      group: "header",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "accentColor",
      type: "string",
      group: "workIndex",
      description: "Hex color for the work-index marker, e.g. #6B4F3A.",
      validation: (rule) =>
        rule
          .required()
          .regex(HEX_COLOR, { name: "hex color" })
          .error("Use a 6-digit hex color like #6B4F3A."),
    }),
    defineField({
      name: "year",
      type: "number",
      group: "workIndex",
      description: "Year shown on the work index.",
      validation: (rule) => rule.required().integer().min(1990).max(2100),
    }),
    defineField({
      name: "category",
      type: "string",
      group: "workIndex",
      description: "e.g. Research, Design systems.",
    }),
    defineField({
      name: "shortDescription",
      type: "string",
      group: "workIndex",
      description: "One line under the name on the homepage card.",
      validation: (rule) =>
        rule.max(120).warning("Keep this to one short line."),
    }),
    defineField({
      name: "previewImage",
      type: "image",
      group: "workIndex",
      options: imageFieldOptions,
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (rule) =>
            rule.custom((alt, context) => {
              const parent = context.parent as { asset?: unknown } | undefined;
              if (!parent?.asset) return true;
              if (!alt?.trim()) return "Alt text is required";
              return true;
            }),
        }),
      ],
    }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "workIndex",
      description: "Show in the command palette under Selected projects.",
      initialValue: false,
    }),
    defineField({
      name: "orderRank",
      type: "number",
      group: "workIndex",
      description: "Lower numbers appear first on the work index.",
      validation: (rule) => rule.required().integer(),
    }),
    defineField({
      name: "body",
      type: "array",
      group: "body",
      of: [
        defineArrayMember({ type: "section" }),
        defineArrayMember({ type: "mediaBlock" }),
        defineArrayMember({ type: "mediaGrid" }),
        defineArrayMember({ type: "statRow" }),
        defineArrayMember({ type: "quote" }),
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "sectionEyebrow" }),
        defineArrayMember({ type: "captionedImage" }),
        defineArrayMember({ type: "imageRow" }),
      ],
      options: {
        insertMenu: {
          filter: true,
        },
      },
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderRankAsc",
      by: [{ field: "orderRank", direction: "asc" }],
    },
    {
      title: "Year, newest",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      year: "year",
      accentColor: "accentColor",
    },
    prepare: ({ title, year, accentColor }) => ({
      title: title || "Untitled case study",
      subtitle: year ? String(year) : undefined,
      media: accentColor
        ? () =>
            createElement("span", {
              style: {
                display: "block",
                width: "100%",
                height: "100%",
                backgroundColor: accentColor,
              },
            })
        : undefined,
    }),
  },
});
