import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#171717",
          color: "#ffffff",
          padding: 72,
          fontSize: 48,
        }}
      >
        <div>{siteConfig.name}</div>
        <div style={{ fontSize: 28, opacity: 0.7 }}>{siteConfig.role}</div>
      </div>
    ),
    size,
  );
}
