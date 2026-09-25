import { defineField } from "sanity";
import { imageFieldOptions } from "../image";

const FRAME_WIDTH = 860;
const FRAME_HEIGHT = 484;

function paddingEdge(name: "top" | "right" | "bottom" | "left") {
  return defineField({
    name,
    type: "number",
    description: "Pixels. Leave empty for the default inset.",
    validation: (rule) => rule.min(0).max(400).integer(),
  });
}

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
    description: "Inset centers the media in the gray frame. Frame padding appears for this fit.",
  }),
  defineField({
    name: "stroke",
    title: "Dark mode stroke",
    type: "boolean",
    description:
      "Hairline around the frame in dark mode. Turn this on when the image is dark and blends into the page.",
    initialValue: false,
  }),
  defineField({
    name: "padding",
    title: "Frame padding",
    type: "object",
    description:
      "Space between the gray frame and the media, in pixels on an 860px-wide frame. Leave a side empty to keep its default: 62 top, 45 right, 54 bottom, 47 left.",
    hidden: ({ parent }) => parent?.fit !== "inset",
    options: { columns: 4 },
    fields: [
      paddingEdge("top"),
      paddingEdge("right"),
      paddingEdge("bottom"),
      paddingEdge("left"),
    ],
    validation: (rule) =>
      rule.custom((padding) => {
        if (!padding || typeof padding !== "object") return true;
        const { top = 0, right = 0, bottom = 0, left = 0 } = padding as {
          top?: number;
          right?: number;
          bottom?: number;
          left?: number;
        };
        if (left + right >= FRAME_WIDTH) {
          return "Left and right padding must leave room inside the 860px frame.";
        }
        if (top + bottom >= FRAME_HEIGHT) {
          return "Top and bottom padding must leave room inside the 16:9 frame.";
        }
        return true;
      }),
  }),
];
