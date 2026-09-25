import { defineField } from "sanity";
import { imageFieldOptions } from "../image";

export const mediaFields = [
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
  defineField({
    name: "video",
    type: "file",
    title: "Video",
    description: "Optional short muted loop. The image is the poster.",
    options: { accept: "video/*" },
  }),
  defineField({
    name: "caption",
    type: "string",
  }),
  defineField({
    name: "fit",
    type: "string",
    options: {
      list: [
        { title: "Cover", value: "cover" },
        { title: "Inset", value: "inset" },
      ],
      layout: "radio",
    },
    initialValue: "cover",
    description: "Inset centers the media in the frame without cropping it.",
  }),
];
