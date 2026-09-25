import { ImagesIcon } from "@sanity/icons/Images";
import { defineArrayMember, defineField, defineType } from "sanity";

export const mediaGrid = defineType({
  name: "mediaGrid",
  title: "Media grid",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "ratio",
      type: "string",
      options: {
        list: [
          { title: "1:1", value: "1:1" },
          { title: "16:9", value: "16:9" },
        ],
        layout: "radio",
      },
      initialValue: "1:1",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "items",
      type: "array",
      of: [defineArrayMember({ type: "media" })],
      validation: (rule) => rule.required().min(2).max(3),
    }),
    defineField({
      name: "caption",
      type: "string",
      description: "Optional caption under the whole grid.",
    }),
  ],
  preview: {
    select: {
      caption: "caption",
      alt: "items.0.alt",
      media: "items.0.image",
    },
    prepare: ({ caption, alt, media }) => ({
      title: caption || alt || "Media grid",
      subtitle: "Media grid",
      media,
    }),
  },
});
