/**
 * Load figures.json into a Sanity caseStudy draft as mediaBlocks (+ optional hero).
 *
 *   SANITY_WRITE_TOKEN=… pnpm exec tsx scripts/figma-import/load.ts \
 *     --manifest scripts/figma-import/out/watch-club/figures.json \
 *     --id <publishedDocId> [--dry-run] [--allow-missing-videos] [--overwrite-hero]
 *
 * imagePath / videoPath are resolved relative to the manifest directory.
 * Always patches drafts.<id> only — never publishes or mutates the published doc.
 */
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { createClient, type SanityClient } from "@sanity/client";
import type { FigureEntry } from "./extract";

type Manifest = {
  slug: string;
  fileKey?: string;
  frameNodeId?: string;
  extractedAt?: string;
  figures: FigureEntry[];
};

type SanityImage = {
  _type: "image";
  asset: { _type: "reference"; _ref: string };
};

type SanityFile = {
  _type: "file";
  asset: { _type: "reference"; _ref: string };
};

type MediaFields = {
  image?: SanityImage;
  alt?: string;
  video?: SanityFile;
  caption?: string;
  fit?: "cover" | "inset";
  stroke?: boolean;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
};

type BodyBlock = {
  _type: string;
  _key?: string;
  caption?: string;
  alt?: string;
  image?: SanityImage;
  video?: SanityFile;
  fit?: "cover" | "inset";
  stroke?: boolean;
  heading?: string;
  eyebrow?: string;
  text?: string;
  quote?: string;
  body?: Array<{
    _type: string;
    children?: Array<{ _type: string; text?: string }>;
  }>;
  children?: Array<{ _type: string; text?: string }>;
} & MediaFields;

type CaseStudyDoc = {
  _id: string;
  _type: string;
  _rev?: string;
  hero?: MediaFields | null;
  body?: BodyBlock[] | null;
  [key: string]: unknown;
};

type PlacementStatus = "NEW" | "REPLACED" | "UNPLACED" | "HERO_NEW" | "HERO_SKIPPED";

type Placement = {
  figure: FigureEntry;
  status: PlacementStatus;
  note?: string;
};

function parseArgs(argv: string[]) {
  const flags = new Set<string>();
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      flags.add(key);
      out[key] = "true";
    } else {
      out[key] = next;
      i++;
    }
  }
  return { out, flags };
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fuzzyMatch(a: string, b: string) {
  const na = normalizeText(a);
  const nb = normalizeText(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  const a60 = na.slice(0, 60);
  const b60 = nb.slice(0, 60);
  return nb.includes(a60) || na.includes(b60);
}

function figmaKey(nodeId: string) {
  return `figma-${nodeId.replace(/:/g, "-")}`;
}

function fitFromInset(inset: boolean): "cover" | "inset" {
  return inset ? "inset" : "cover";
}

function blockPlainText(block: BodyBlock): string {
  if (block._type === "section") {
    const parts: string[] = [];
    if (block.heading) parts.push(block.heading);
    if (block.eyebrow) parts.push(block.eyebrow);
    for (const b of block.body ?? []) {
      if (b._type === "block") {
        const t = (b.children ?? []).map((c) => c.text ?? "").join("");
        if (t) parts.push(t);
      }
    }
    return parts.join("\n");
  }
  if (block._type === "block") {
    return (block.children ?? []).map((c) => c.text ?? "").join("");
  }
  if (block._type === "sectionEyebrow") {
    return block.text ?? "";
  }
  if (block._type === "quote") {
    return block.quote ?? "";
  }
  return "";
}

function outlineLabel(block: BodyBlock): string {
  if (block._type === "mediaBlock") {
    return `[FIGURE: ${block.caption || block.alt || "(no caption)"}]`;
  }
  if (block._type === "section") {
    return `## ${block.heading || "(section)"}`;
  }
  if (block._type === "sectionEyebrow") {
    return `eyebrow: ${block.text || ""}`;
  }
  if (block._type === "quote") {
    return `quote: ${(block.quote || "").slice(0, 60)}`;
  }
  if (block._type === "block") {
    const t = blockPlainText(block);
    return t ? t.slice(0, 80) : "(empty block)";
  }
  if (block._type === "mediaGrid") return "[mediaGrid]";
  if (block._type === "statRow") return "[statRow]";
  if (block._type === "imageRow") return "[imageRow]";
  if (block._type === "captionedImage") {
    return `[captionedImage: ${block.caption || ""}]`;
  }
  return `[${block._type}]`;
}

function buildMediaFields(opts: {
  imageRef: string;
  videoRef?: string;
  alt: string;
  caption: string;
  inset: boolean;
}): MediaFields {
  const fields: MediaFields = {
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: opts.imageRef },
    },
    alt: opts.alt,
    caption: opts.caption || undefined,
    fit: fitFromInset(opts.inset),
    stroke: false,
  };
  if (opts.videoRef) {
    fields.video = {
      _type: "file",
      asset: { _type: "reference", _ref: opts.videoRef },
    };
  }
  return fields;
}

async function ensureDraft(
  client: SanityClient,
  publishedId: string,
): Promise<CaseStudyDoc> {
  const bareId = publishedId.replace(/^drafts\./, "");
  const draftId = `drafts.${bareId}`;

  const existingDraft = await client.getDocument<CaseStudyDoc>(draftId);
  if (existingDraft) return existingDraft;

  const published = await client.getDocument<CaseStudyDoc>(bareId);
  if (!published) {
    throw new Error(`No published document found for id ${bareId}`);
  }

  const { _rev: _ignored, ...rest } = published;
  const draftDoc = { ...rest, _id: draftId } as CaseStudyDoc;
  await client.createOrReplace(draftDoc);
  console.log(`Created draft ${draftId} from published ${bareId}`);
  return draftDoc;
}

async function uploadImage(
  client: SanityClient,
  filePath: string,
): Promise<string> {
  const uploaded = await client.assets.upload("image", createReadStream(filePath), {
    filename: path.basename(filePath),
  });
  return uploaded._id;
}

async function uploadVideo(
  client: SanityClient,
  filePath: string,
): Promise<string> {
  const uploaded = await client.assets.upload("file", createReadStream(filePath), {
    filename: path.basename(filePath),
    contentType: "video/mp4",
  });
  return uploaded._id;
}

function findMediaBlockByCaption(
  body: BodyBlock[],
  caption: string,
): { index: number; block: BodyBlock } | null {
  if (!caption) return null;
  for (let i = 0; i < body.length; i++) {
    const b = body[i];
    if (b._type !== "mediaBlock") continue;
    if (fuzzyMatch(b.caption ?? "", caption)) {
      return { index: i, block: b };
    }
  }
  return null;
}

function findAnchorIndex(body: BodyBlock[], anchorText: string): number {
  for (let i = 0; i < body.length; i++) {
    const b = body[i];
    if (b._type === "mediaBlock" || b._type === "mediaGrid" || b._type === "captionedImage") {
      continue;
    }
    const text = blockPlainText(b);
    if (text && fuzzyMatch(anchorText, text)) return i;
  }
  return -1;
}

async function main() {
  const { out: args, flags } = parseArgs(process.argv.slice(2));
  const dryRun = flags.has("dry-run");
  const allowMissingVideos = flags.has("allow-missing-videos");
  const overwriteHero = flags.has("overwrite-hero");
  const manifestPath = args.manifest;
  const docIdArg = args.id;

  if (!manifestPath || !docIdArg) {
    console.error(
      "Usage: --manifest <path/to/figures.json> --id <publishedDocId> [--dry-run] [--allow-missing-videos] [--overwrite-hero]",
    );
    process.exit(1);
  }

  if (docIdArg.startsWith("drafts.")) {
    console.error("Pass the published document id (without drafts. prefix)");
    process.exit(1);
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token =
    process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !token) {
    console.error(
      "Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN (or SANITY_API_WRITE_TOKEN)",
    );
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: "2026-01-01",
    token,
    useCdn: false,
  });

  const absManifest = path.resolve(manifestPath);
  const manifestDir = path.dirname(absManifest);
  const manifest = JSON.parse(
    await fs.readFile(absManifest, "utf8"),
  ) as Manifest;

  if (!manifest.slug || !Array.isArray(manifest.figures)) {
    console.error("Invalid manifest: need slug and figures[]");
    process.exit(1);
  }

  const heroFigures = manifest.figures.filter((f) => f.role === "hero");
  const bodyFigures = manifest.figures
    .filter((f) => f.role !== "hero")
    .sort((a, b) => a.order - b.order);

  // Resolve paths + missing videos
  type Resolved = {
    figure: FigureEntry;
    imageAbs: string;
    videoAbs: string | null;
    missingVideo: boolean;
  };

  const resolved: Resolved[] = [];
  const missingVideos: string[] = [];

  for (const figure of manifest.figures) {
    const imageAbs = path.resolve(manifestDir, figure.imagePath);
    try {
      await fs.access(imageAbs);
    } catch {
      console.error(`Missing image: ${imageAbs}`);
      process.exit(1);
    }

    let videoAbs: string | null = null;
    let missingVideo = false;
    if (figure.needsVideo || figure.videoPath) {
      const vp = figure.videoPath ?? `videos/${figure.slug}.mp4`;
      videoAbs = path.resolve(manifestDir, vp);
      try {
        await fs.access(videoAbs);
      } catch {
        missingVideo = true;
        missingVideos.push(path.relative(manifestDir, videoAbs));
        videoAbs = null;
      }
    }
    resolved.push({ figure, imageAbs, videoAbs, missingVideo });
  }

  if (missingVideos.length && !allowMissingVideos && !dryRun) {
    console.error("Missing video files (use --allow-missing-videos to proceed):");
    for (const m of missingVideos) console.error(`  - ${m}`);
    process.exit(1);
  }
  if (missingVideos.length && dryRun) {
    console.warn("Missing videos (dry-run; would fail without --allow-missing-videos):");
    for (const m of missingVideos) console.warn(`  - ${m}`);
  }

  const draftId = `drafts.${docIdArg}`;
  let draft: CaseStudyDoc;

  if (dryRun) {
    // Read draft or published for outline — no writes
    draft =
      (await client.getDocument<CaseStudyDoc>(draftId)) ??
      (await client.getDocument<CaseStudyDoc>(docIdArg)) ??
      ({ _id: draftId, _type: "caseStudy", body: [], hero: null } as CaseStudyDoc);
    console.log(
      `(dry-run) using ${draft._id.startsWith("drafts.") ? "draft" : "published copy for preview"} ${draft._id}`,
    );
  } else {
    draft = await ensureDraft(client, docIdArg);

    const backupPath = path.join(
      manifestDir,
      `backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
    );
    await fs.writeFile(
      backupPath,
      JSON.stringify(
        {
          _id: draft._id,
          hero: draft.hero ?? null,
          body: draft.body ?? [],
        },
        null,
        2,
      ) + "\n",
    );
    console.log(`Backup → ${backupPath}`);
  }

  const body: BodyBlock[] = Array.isArray(draft.body) ? [...draft.body] : [];
  const placements: Placement[] = [];
  const byFigure = new Map(resolved.map((r) => [r.figure.figmaNodeId, r]));

  // Upload map (skipped on dry-run)
  const uploadedImage = new Map<string, string>();
  const uploadedVideo = new Map<string, string>();

  async function ensureAssets(figure: FigureEntry) {
    const r = byFigure.get(figure.figmaNodeId)!;
    if (dryRun) {
      return { imageRef: "image-dry-run", videoRef: r.videoAbs ? "file-dry-run" : undefined };
    }
    let imageRef = uploadedImage.get(figure.figmaNodeId);
    if (!imageRef) {
      imageRef = await uploadImage(client, r.imageAbs);
      uploadedImage.set(figure.figmaNodeId, imageRef);
      console.log(`Uploaded image ${figure.slug} → ${imageRef}`);
    }
    let videoRef: string | undefined;
    if (r.videoAbs) {
      videoRef = uploadedVideo.get(figure.figmaNodeId);
      if (!videoRef) {
        videoRef = await uploadVideo(client, r.videoAbs);
        uploadedVideo.set(figure.figmaNodeId, videoRef);
        console.log(`Uploaded video ${figure.slug} → ${videoRef}`);
      }
    } else if (r.missingVideo) {
      console.warn(`Loaded without video: ${figure.slug}`);
    }
    return { imageRef, videoRef };
  }

  // --- Hero ---
  let nextHero = draft.hero ?? null;
  for (const figure of heroFigures) {
    const heroHasImage = Boolean(draft.hero?.image?.asset?._ref);
    if (heroHasImage && !overwriteHero) {
      placements.push({
        figure,
        status: "HERO_SKIPPED",
        note: "hero exists, skipped",
      });
      continue;
    }
    const { imageRef, videoRef } = await ensureAssets(figure);
    const existingAlt = draft.hero?.alt?.trim() || "";
    nextHero = buildMediaFields({
      imageRef,
      videoRef,
      alt: existingAlt || figure.alt || "",
      caption: figure.caption || draft.hero?.caption || "",
      inset: figure.inset,
    });
    placements.push({
      figure,
      status: "HERO_NEW",
      note: heroHasImage ? "overwritten" : "filled empty hero",
    });
  }

  // --- Body placement ---
  // Track insertion cursors per anchor so multiple figures stack in order
  const insertAfterByAnchor = new Map<string, number>();

  for (const figure of bodyFigures) {
    const byCaption = findMediaBlockByCaption(body, figure.caption);
    if (byCaption) {
      const { imageRef, videoRef } = await ensureAssets(figure);
      const existing = byCaption.block;
      const keepAlt = existing.alt?.trim() || figure.alt || "";
      const fields = buildMediaFields({
        imageRef,
        videoRef,
        alt: keepAlt,
        caption: figure.caption || existing.caption || "",
        inset: figure.inset,
      });
      const updated: BodyBlock = {
        ...existing,
        _type: "mediaBlock",
        _key: existing._key || figmaKey(figure.figmaNodeId),
        ...fields,
      };
      // Update video only when a file was uploaded. If needsVideo but missing
      // (allow-missing-videos), omit video. Otherwise keep any existing video.
      const r = byFigure.get(figure.figmaNodeId)!;
      if (!videoRef) {
        if (figure.needsVideo && r.missingVideo) {
          delete updated.video;
        } else if (existing.video) {
          updated.video = existing.video;
        } else {
          delete updated.video;
        }
      }
      body[byCaption.index] = updated;
      placements.push({ figure, status: "REPLACED" });
      continue;
    }

    if (!figure.anchorText) {
      placements.push({
        figure,
        status: "UNPLACED",
        note: "no caption match and no anchorText",
      });
      continue;
    }

    const anchorKey = normalizeText(figure.anchorText);
    let afterIndex = insertAfterByAnchor.get(anchorKey);
    if (afterIndex === undefined) {
      afterIndex = findAnchorIndex(body, figure.anchorText);
      if (afterIndex < 0) {
        placements.push({
          figure,
          status: "UNPLACED",
          note: `no anchor match for ${JSON.stringify(figure.anchorText.slice(0, 60))}`,
        });
        continue;
      }
    }

    const { imageRef, videoRef } = await ensureAssets(figure);
    const newBlock: BodyBlock = {
      _type: "mediaBlock",
      _key: figmaKey(figure.figmaNodeId),
      ...buildMediaFields({
        imageRef,
        videoRef,
        alt: figure.alt || "",
        caption: figure.caption,
        inset: figure.inset,
      }),
    };
    const insertAt = afterIndex + 1;
    body.splice(insertAt, 0, newBlock);
    insertAfterByAnchor.set(anchorKey, insertAt);
    placements.push({ figure, status: "NEW" });
  }

  // Outline
  console.log("\n=== Outline ===");
  const heroPlacement = placements.find((p) => p.figure.role === "hero");
  if (heroPlacement) {
    console.log(
      `HERO  ${heroPlacement.status}${heroPlacement.note ? ` (${heroPlacement.note})` : ""}  ${heroPlacement.figure.slug}`,
    );
  } else {
    console.log("HERO  (none in manifest)");
  }

  // Annotate body outline with placement markers where possible
  const replacedKeys = new Set(
    placements
      .filter((p) => p.status === "REPLACED")
      .map((p) => p.figure.caption)
      .filter(Boolean),
  );
  const newKeys = new Set(
    placements
      .filter((p) => p.status === "NEW")
      .map((p) => figmaKey(p.figure.figmaNodeId)),
  );

  for (const block of body) {
    let mark = "";
    if (block._type === "mediaBlock") {
      if (block._key && newKeys.has(block._key)) mark = " NEW";
      else if (block.caption && [...replacedKeys].some((c) => fuzzyMatch(c, block.caption!))) {
        mark = " REPLACED";
      }
    }
    console.log(`  ${outlineLabel(block)}${mark}`);
  }

  const unplaced = placements.filter((p) => p.status === "UNPLACED");
  console.log("\n=== Unplaced ===");
  if (!unplaced.length) {
    console.log("(none)");
  } else {
    for (const p of unplaced) {
      console.log(
        `  - ${p.figure.slug} (${p.figure.figmaNodeId}): ${p.note || "unplaced"}`,
      );
    }
  }

  if (!dryRun) {
    const patch: { hero?: MediaFields; body: BodyBlock[] } = { body };
    if (heroFigures.length && nextHero) {
      const heroAction = placements.find((p) => p.figure.role === "hero");
      if (heroAction && heroAction.status === "HERO_NEW") {
        patch.hero = nextHero;
      }
    }
    await client.patch(draftId).set(patch).commit({ autoGenerateArrayKeys: false });
    console.log(`\nPatched ${draftId}`);
  } else {
    console.log("\n(dry-run) no uploads or patches");
  }

  if (unplaced.length) {
    process.exitCode = 1;
  }
  if (missingVideos.length && !allowMissingVideos) {
    // dry-run already warned; real run would have exited earlier
    if (dryRun) process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
