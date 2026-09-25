import { ImagesIcon } from "@sanity/icons/Images";
import { defineArrayMember, defineField, defineType } from "sanity";

export const imageRow = defineType({
  name: "imageRow",
  title: "Image row",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "images",
      type: "array",
      of: [defineArrayMember({ type: "captionedImage" })],
      validation: (rule) => rule.required().min(2).max(3),
    }),
  ],
  preview: {
    select: {
      caption0: "images.0.caption",
      caption1: "images.1.caption",
      alt0: "images.0.alt",
      media: "images.0.image",
    },
    prepare: ({ caption0, caption1, alt0, media }) => ({
      title: [caption0 || alt0, caption1].filter(Boolean).join(" / ") || "Image row",
      subtitle: "Image row",
      media,
    }),
  },
});
