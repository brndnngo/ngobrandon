/**
 * Upload Webflow assets into Sanity.
 *
 *   SANITY_API_WRITE_TOKEN=... pnpm exec tsx scripts/upload-to-sanity.ts
 *
 * Reads content/assets/inventory.json and content/assets/alt-text.json.
 */
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const ROOT = path.resolve(import.meta.dirname, "..");

type Asset = {
  id: string;
  displayName: string;
  hostedUrl: string;
  contentType: string;
  kind: "image" | "video" | "lottie" | "other";
};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-01-01",
  token,
  useCdn: false,
});

const inventory = JSON.parse(
  await fs.readFile(path.join(ROOT, "content/assets/inventory.json"), "utf8"),
) as { assets: Asset[] };
const altMap = JSON.parse(
  await fs.readFile(path.join(ROOT, "content/assets/alt-text.json"), "utf8"),
) as Record<string, { alt: string; filename: string }>;

const tmp = path.join(ROOT, ".tmp-assets");
await fs.mkdir(tmp, { recursive: true });

for (const asset of inventory.assets) {
  const mapping = altMap[asset.id];
  const filename = mapping?.filename || asset.displayName;
  const dest = path.join(tmp, filename);

  const res = await fetch(asset.hostedUrl);
  if (!res.ok) {
    console.warn("skip", asset.hostedUrl, res.status);
    continue;
  }
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));

  const kind = asset.kind === "video" ? "file" : "image";
  const uploaded = await client.assets.upload(
    kind,
    createReadStream(dest),
    {
      filename,
      contentType: asset.contentType,
    },
  );

  if (mapping?.alt) {
    await client
      .patch(uploaded._id)
      .set({ altText: mapping.alt })
      .commit();
  }

  console.log("uploaded", filename, uploaded._id);
}
