/**
 * Classify a Webflow asset list. Feed it inventory harvested via MCP or curl.
 *
 *   pnpm exec tsx scripts/classify-assets.ts content/assets/raw-webflow.json
 */
import { promises as fs } from "node:fs";

type Raw = {
  id: string;
  displayName?: string;
  originalFileName?: string;
  hostedUrl?: string;
  contentType?: string;
  size?: number;
  altText?: string | null;
};

function kindOf(asset: Raw) {
  const name = (asset.displayName || asset.originalFileName || "").toLowerCase();
  const type = (asset.contentType || "").toLowerCase();
  if (name.endsWith(".json") || name.endsWith(".lottie") || type.includes("json")) {
    return "lottie";
  }
  if (type.startsWith("video") || /\.(mp4|mov|webm|m4v)$/.test(name)) return "video";
  if (type.startsWith("image") || /\.(png|jpe?g|gif|webp|avif|svg)$/.test(name)) {
    return "image";
  }
  return "other";
}

const input = process.argv[2] ?? "content/assets/raw-webflow.json";
const raw = JSON.parse(await fs.readFile(input, "utf8")) as Raw[];

const assets = raw.map((asset) => ({
  id: asset.id,
  displayName: asset.displayName || asset.originalFileName || asset.id,
  hostedUrl: asset.hostedUrl ?? "",
  contentType: asset.contentType ?? "",
  size: asset.size ?? 0,
  kind: kindOf(asset),
  existingAlt: asset.altText || "",
}));

await fs.mkdir("content/assets", { recursive: true });
await fs.writeFile(
  "content/assets/inventory.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), assets }, null, 2),
);

console.log(
  `Wrote ${assets.length} assets (${assets.filter((a) => a.kind === "lottie").length} lottie, ${assets.filter((a) => a.kind === "video").length} video, ${assets.filter((a) => a.kind === "image").length} image)`,
);
