import { ImageIcon } from "@sanity/icons/Image";
import { defineField, defineType } from "sanity";
import { imageFieldOptions } from "../image";

export const captionedImage = defineType({
  name: "captionedImage",
  title: "Captioned image",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "caption",
      type: "string",
      description: "Shown above the image on the case study page.",
    }),
    defineField({
      name: "image",
      type: "image",
      options: imageFieldOptions,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      type: "string",
      title: "Alt text",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "caption", subtitle: "alt", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || subtitle || "Captioned image",
      subtitle: title ? subtitle : "Captioned image",
      media,
    }),
  },
});
