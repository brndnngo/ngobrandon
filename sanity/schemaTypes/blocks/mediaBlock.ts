import { ImageIcon } from "@sanity/icons/Image";
import { defineType } from "sanity";
import { mediaFields } from "../objects/media";

export const media = defineType({
  name: "media",
  title: "Media",
  type: "object",
  icon: ImageIcon,
  fields: mediaFields,
  preview: {
    select: { title: "caption", subtitle: "alt", media: "image" },
    prepare: ({ title, subtitle, media: image }) => ({
      title: title || subtitle || "Media",
      subtitle: "Media",
      media: image,
    }),
  },
});

export const mediaBlock = defineType({
  name: "mediaBlock",
  title: "Media",
  type: "object",
  icon: ImageIcon,
  fields: mediaFields,
  preview: {
    select: { title: "caption", subtitle: "alt", media: "image" },
    prepare: ({ title, subtitle, media: image }) => ({
      title: title || subtitle || "Media",
      subtitle: "Media",
      media: image,
    }),
  },
});
