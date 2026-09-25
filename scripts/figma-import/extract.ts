/**
 * Extract case-study figures from a Figma frame into PNG posters + figures.json.
 *
 *   FIGMA_TOKEN=… pnpm exec tsx scripts/figma-import/extract.ts \
 *     --file uhnwbqxTKzdF4Il5UEInGJ --node 321:13572 --slug watch-club
 *
 * imagePath / videoPath in the manifest are relative to the manifest directory
 * (scripts/figma-import/out/<slug>/). Drop videos at videos/<figure-slug>.mp4.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const FIGMA_API = "https://api.figma.com/v1";

type FigmaFill = { type: string; visible?: boolean };
type FigmaNode = {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
  characters?: string;
  fills?: FigmaFill[];
  children?: FigmaNode[];
};

type FlatNode = {
  node: FigmaNode;
  absX: number;
  absY: number;
  width: number;
  height: number;
  depth: number;
  parentId: string | null;
};

export type FigureEntry = {
  order: number;
  role: "hero" | "body";
  figmaNodeId: string;
  slug: string;
  imagePath: string;
  caption: string;
  alt: string;
  inset: boolean;
  videoPath: string | null;
  needsVideo: boolean;
  anchorText: string | null;
};

type Manifest = {
  slug: string;
  fileKey: string;
  frameNodeId: string;
  extractedAt: string;
  figures: FigureEntry[];
};

function parseArgs(argv: string[]) {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const val = argv[i + 1];
    if (!val || val.startsWith("--")) {
      out[key] = "true";
    } else {
      out[key] = val;
      i++;
    }
  }
  return out;
}

function normalizeNodeId(id: string) {
  return id.replace(/-/g, ":");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "figure";
}

function uniqueSlug(base: string, used: Set<string>) {
  let slug = base || "figure";
  if (!used.has(slug)) {
    used.add(slug);
    return slug;
  }
  let n = 2;
  while (used.has(`${slug}-${n}`)) n++;
  const next = `${slug}-${n}`;
  used.add(next);
  return next;
}

function isVisible(node: FigmaNode) {
  return node.visible !== false;
}

function hasVideoFill(node: FigmaNode): boolean {
  const fills = node.fills ?? [];
  if (fills.some((f) => f.visible !== false && f.type === "VIDEO")) return true;
  return (node.children ?? []).some(hasVideoFill);
}

function flatten(node: FigmaNode, depth = 0, parentId: string | null = null): FlatNode[] {
  if (!isVisible(node)) return [];
  const box = node.absoluteBoundingBox;
  const self: FlatNode[] = box
    ? [
        {
          node,
          absX: box.x,
          absY: box.y,
          width: box.width,
          height: box.height,
          depth,
          parentId,
        },
      ]
    : [];
  const kids = (node.children ?? []).flatMap((c) => flatten(c, depth + 1, node.id));
  return [...self, ...kids];
}

function isContentColumnX(x: number, frameX: number) {
  const rel = x - frameX;
  return rel >= 250 && rel <= 320;
}

function isMediaSize(w: number, h: number) {
  const wide = w >= 840 && w <= 880;
  const full = h >= 400 && h <= 480;
  const half = h >= 200 && h <= 240;
  return wide && (full || half);
}

function isCaptionSize(w: number, h: number) {
  return w >= 800 && h <= 28;
}

function captionText(node: FigmaNode) {
  return (node.characters ?? node.name ?? "").trim();
}

function findCaptionForMedia(
  media: FlatNode,
  texts: FlatNode[],
): FlatNode | null {
  const bottom = media.absY + media.height;
  let best: FlatNode | null = null;
  let bestGap = Infinity;
  for (const t of texts) {
    if (!isCaptionSize(t.width, t.height)) continue;
    // Same column-ish
    if (Math.abs(t.absX - media.absX) > 40) continue;
    const gap = t.absY - bottom;
    if (gap >= -4 && gap <= 50 && gap < bestGap) {
      best = t;
      bestGap = gap;
    }
  }
  return best;
}

function isFootnote(text: string) {
  return text.trimStart().startsWith("*");
}

function isPlaceholderCaption(text: string) {
  return text.trim().toLowerCase() === "placeholder";
}

// Sanity still has a "Reclip" heading. These captions sit under the rewritten
// Figma paragraph, so pin them to that heading instead of the new paragraph.
const RECLIP_CAPTIONS = new Set([
  "reclip flow",
  "liquid glass behavior",
  "post (reclip card, bottom sheet)",
]);

// Figma's REST file payload reports VIDEO paints as IMAGE, so fill type
// alone misses Watch Club loops. These captions were confirmed as VIDEO fills.
const WATCH_CLUB_VIDEO_CAPTIONS = new Set([
  "sizzle reel",
  "clipping flow",
  "jump to episode flow",
  "scene pack flow",
  "reclip flow",
  "liquid glass behavior",
  "post (reclip card, bottom sheet)",
]);

function anchorForFigure(caption: string, nearest: string | null) {
  if (RECLIP_CAPTIONS.has(caption.trim().toLowerCase())) return "Reclip";
  return nearest;
}

function isProseText(flat: FlatNode) {
  if (flat.node.type !== "TEXT") return false;
  const w = flat.width;
  const h = flat.height;
  // Body prose is typically ~595 wide; headings can be narrower/taller
  if (w < 200) return false;
  if (isCaptionSize(w, h)) return false;
  const text = captionText(flat.node);
  if (!text || isFootnote(text)) return false;
  // Skip tiny UI chrome labels
  if (text.length < 8) return false;
  return true;
}

function findAnchorText(media: FlatNode, prose: FlatNode[]): string | null {
  let best: FlatNode | null = null;
  for (const p of prose) {
    if (p.absY >= media.absY - 2) continue;
    // Prefer content in the left text column (x ~290) or overlapping media x
    const sameColumn =
      Math.abs(p.absX - media.absX) < 80 ||
      (p.absX >= media.absX - 20 && p.absX <= media.absX + 100);
    if (!sameColumn && p.width < 500) continue;
    if (!best || p.absY > best.absY) best = p;
  }
  return best ? captionText(best.node) : null;
}

function pickExportNode(candidate: FlatNode, all: FlatNode[]): FlatNode {
  // Prefer the innermost ~860×(217|410–434) media frame inside caption wrappers.
  const queue: FlatNode[] = [candidate];
  let best: FlatNode | null = null;

  while (queue.length) {
    const cur = queue.shift()!;
    if (isMediaSize(cur.width, cur.height) && cur.height <= 450) {
      // Prefer shorter full slides over outer 470 wrappers
      if (!best || cur.height < best.height || cur.depth > best.depth) {
        best = cur;
      }
    }
    for (const child of all.filter((n) => n.parentId === cur.node.id)) {
      if (
        ["FRAME", "RECTANGLE", "GROUP", "COMPONENT", "INSTANCE"].includes(
          child.node.type,
        )
      ) {
        queue.push(child);
      }
    }
  }

  if (best && best.node.id !== candidate.node.id) return best;
  if (isMediaSize(candidate.width, candidate.height)) return candidate;
  return best ?? candidate;
}

async function figmaGet<T>(token: string, urlPath: string): Promise<T> {
  const res = await fetch(`${FIGMA_API}${urlPath}`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma ${res.status} ${urlPath}: ${body.slice(0, 400)}`);
  }
  return res.json() as Promise<T>;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const fileKey = args.file;
  const nodeId = args.node ? normalizeNodeId(args.node) : "";
  const slug = args.slug;
  const token = process.env.FIGMA_TOKEN;

  if (!fileKey || !nodeId || !slug) {
    console.error(
      "Usage: --file <key> --node <id> --slug <slug>  (FIGMA_TOKEN required)",
    );
    process.exit(1);
  }
  if (!token) {
    console.error("Set FIGMA_TOKEN");
    process.exit(1);
  }

  const outDir = path.resolve(
    import.meta.dirname,
    "out",
    slug,
  );
  await fs.mkdir(path.join(outDir, "videos"), { recursive: true });

  console.log(`Fetching frame ${nodeId} from ${fileKey}…`);
  const encodedId = encodeURIComponent(nodeId);
  const nodesRes = await figmaGet<{
    nodes: Record<string, { document: FigmaNode } | null>;
  }>(token, `/files/${fileKey}/nodes?ids=${encodedId}&geometry=paths`);

  const doc = nodesRes.nodes[nodeId]?.document;
  if (!doc) {
    console.error(`Node ${nodeId} not found in file`);
    process.exit(1);
  }

  const frameBox = doc.absoluteBoundingBox;
  if (!frameBox) {
    console.error("Frame has no absoluteBoundingBox");
    process.exit(1);
  }

  const flat = flatten(doc);
  const texts = flat.filter((n) => n.node.type === "TEXT");
  const prose = flat.filter(isProseText);

  // Candidate media: content-column nodes of media size, or hero-sized near top
  const mediaCandidates = flat.filter((n) => {
    if (!["FRAME", "RECTANGLE", "GROUP", "COMPONENT", "INSTANCE"].includes(n.node.type)) {
      return false;
    }
    if (!isMediaSize(n.width, n.height)) return false;
    // Prefer content column; allow nested media whose parent is already content-x
    if (!isContentColumnX(n.absX, frameBox.x)) {
      // Still allow if parent group is content-column
      const parent = flat.find((p) => p.node.id === n.parentId);
      if (!parent || !isContentColumnX(parent.absX, frameBox.x)) return false;
    }
    // Skip tiny nested UI chrome inside slides (depth very deep + small name patterns)
    return true;
  });

  // Prefer outermost wrappers: if a node is inside another media candidate, skip the outer group
  // We'll collect unique export targets
  type Detected = {
    exportNode: FlatNode;
    caption: string;
    role: "hero" | "body";
    needsVideo: boolean;
    anchorText: string | null;
    flagged?: string;
  };

  const detected: Detected[] = [];
  const usedExportIds = new Set<string>();
  const flaggedPlaceholders: string[] = [];

  // Hero: near top of frame, ~860x432
  const heroCandidates = flat
    .filter((n) => {
      const relY = n.absY - frameBox.y;
      return (
        relY >= 60 &&
        relY <= 150 &&
        n.width >= 840 &&
        n.width <= 880 &&
        n.height >= 400 &&
        n.height <= 450 &&
        isContentColumnX(n.absX, frameBox.x) &&
        ["FRAME", "RECTANGLE", "GROUP", "COMPONENT", "INSTANCE"].includes(n.node.type)
      );
    })
    .sort((a, b) => a.absY - b.absY);

  if (slug === "amazon-alchemy") {
    console.log("Skipping hero for amazon-alchemy");
  } else if (heroCandidates.length) {
    // Prefer a FRAME with children (Watch Club stage), else widest stage rect.
    const exportHero =
      heroCandidates.find(
        (h) => h.node.type === "FRAME" && (h.node.children?.length ?? 0) > 0,
      ) ??
      heroCandidates.find((h) =>
        (h.node.fills ?? []).some(
          (f) => f.visible !== false && (f.type === "IMAGE" || f.type === "VIDEO"),
        ),
      ) ??
      heroCandidates[0];

    // VIDEO may live on a child (Watch Club trimmedvideo) or nearby overlay
    const heroBand = flat.filter((n) => {
      const relY = n.absY - frameBox.y;
      return relY >= 60 && relY <= 160;
    });
    const needsVideo =
      slug === "watch-club" ||
      hasVideoFill(exportHero.node) ||
      heroBand.some((n) => hasVideoFill(n.node));

    // Alchemy: gray stage + sibling screenshot. The Images API renders one node
    // tree, so a stage with no image fill would export as an empty rectangle.
    // Export the sibling screenshot instead.
    const stageHasMedia = (exportHero.node.fills ?? []).some(
      (f) => f.visible !== false && (f.type === "IMAGE" || f.type === "VIDEO"),
    ) || hasVideoFill(exportHero.node);
    const siblingShot = flat.find(
      (n) =>
        n.node.id !== exportHero.node.id &&
        Math.abs(n.absY - exportHero.absY) < 50 &&
        (n.node.fills ?? []).some((f) => f.visible !== false && f.type === "IMAGE") &&
        n.width >= 300,
    );
    const heroExport =
      !stageHasMedia && siblingShot ? siblingShot : exportHero;

    detected.push({
      exportNode: heroExport,
      caption: "",
      role: "hero",
      needsVideo,
      anchorText: null,
      flagged:
        heroExport.node.id !== exportHero.node.id
          ? `hero stage ${exportHero.node.id} has no image fill; exporting sibling ${heroExport.node.id} (“${heroExport.node.name}”)`
          : undefined,
    });
    usedExportIds.add(heroExport.node.id);
    usedExportIds.add(exportHero.node.id);
  }

  // Body figures: media with caption ~16px below
  // Sort candidates top-to-bottom; skip nodes already used or nested inside another selected media
  const bodyMedia = mediaCandidates
    .filter((m) => {
      const relY = m.absY - frameBox.y;
      return relY > 200; // below hero
    })
    .sort((a, b) => a.absY - b.absY || a.depth - b.depth);

  for (const raw of bodyMedia) {
    const exportNode = pickExportNode(raw, flat);
    if (usedExportIds.has(exportNode.node.id)) continue;

    // Skip if this node is nested inside an already-selected export (except caption groups)
    const nestedInSelected = detected.some((d) => {
      if (d.role === "hero") return false;
      const sel = d.exportNode;
      return (
        exportNode.absX >= sel.absX - 2 &&
        exportNode.absY >= sel.absY - 2 &&
        exportNode.absX + exportNode.width <= sel.absX + sel.width + 2 &&
        exportNode.absY + exportNode.height <= sel.absY + sel.height + 2 &&
        exportNode.node.id !== sel.node.id
      );
    });
    if (nestedInSelected) continue;

    // Skip outer groups when we'll pick the inner — if raw is group and export differs, still use export
    const captionNode = findCaptionForMedia(exportNode, texts);
    // Also try caption against the outer raw if export is inner
    const captionNodeAlt =
      exportNode.node.id !== raw.node.id ? findCaptionForMedia(raw, texts) : null;
    const cap = captionNode ?? captionNodeAlt;

    // Groups of ~470 height with inner caption text child
    let caption = cap ? captionText(cap.node) : "";
    if (!caption && (raw.node.type === "GROUP" || raw.node.type === "FRAME")) {
      const childTexts = flat.filter(
        (n) =>
          n.parentId === raw.node.id &&
          n.node.type === "TEXT" &&
          isCaptionSize(n.width, n.height),
      );
      if (childTexts.length) {
        caption = captionText(childTexts.sort((a, b) => b.absY - a.absY)[0].node);
      }
      // Nested group (Receive pattern)
      const nestedGroups = flat.filter((n) => n.parentId === raw.node.id);
      for (const ng of nestedGroups) {
        const nestedCaps = flat.filter(
          (n) =>
            n.parentId === ng.node.id &&
            n.node.type === "TEXT" &&
            isCaptionSize(n.width, n.height),
        );
        if (nestedCaps.length) {
          caption = captionText(nestedCaps.sort((a, b) => b.absY - a.absY)[0].node);
          break;
        }
      }
    }

    if (!caption) {
      // Half-height slides without caption — skip unless they look intentional
      continue;
    }
    if (isFootnote(caption)) continue;
    if (isPlaceholderCaption(caption)) {
      flaggedPlaceholders.push(
        `${exportNode.node.id} "${exportNode.node.name}" — caption "Placeholder"`,
      );
      continue;
    }

    // Skip duplicate exports of the same visual (outer group + inner slide)
    if (usedExportIds.has(exportNode.node.id)) continue;

    const needsVideo =
      hasVideoFill(exportNode.node) ||
      (slug === "watch-club" &&
        WATCH_CLUB_VIDEO_CAPTIONS.has(caption.trim().toLowerCase()));

    detected.push({
      exportNode,
      caption,
      role: "body",
      needsVideo,
      anchorText: anchorForFigure(caption, findAnchorText(exportNode, prose)),
    });
    usedExportIds.add(exportNode.node.id);
    // Also mark the outer raw if different
    usedExportIds.add(raw.node.id);
  }

  // Deduplicate by similar y (prefer deeper/more specific export)
  detected.sort((a, b) => a.exportNode.absY - b.exportNode.absY);

  console.log("\n=== Inspect ===");
  for (const d of detected) {
    const n = d.exportNode;
    console.log(
      [
        d.role === "hero" ? "HERO" : "BODY",
        n.node.id,
        JSON.stringify(n.node.name),
        `${Math.round(n.width)}x${Math.round(n.height)}`,
        d.needsVideo ? "VIDEO" : "still",
        d.caption ? `cap=${JSON.stringify(d.caption.slice(0, 60))}` : "cap=",
        d.anchorText
          ? `anchor=${JSON.stringify(d.anchorText.slice(0, 50))}`
          : "anchor=null",
      ].join("  "),
    );
  }
  if (flaggedPlaceholders.length) {
    console.log("\nFlagged placeholders (skipped):");
    for (const f of flaggedPlaceholders) console.log(`  - ${f}`);
  }
  const otherFlags = detected.filter((d) => d.flagged);
  if (otherFlags.length) {
    console.log("\nOther flags:");
    for (const d of otherFlags) console.log(`  - ${d.flagged}`);
  }

  // Export PNGs at 2x
  const exportIds = detected.map((d) => d.exportNode.node.id);
  console.log(`\nRequesting ${exportIds.length} PNG exports at 2x…`);
  const imagesRes = await figmaGet<{
    err: string | null;
    images: Record<string, string | null>;
  }>(
    token,
    `/images/${fileKey}?ids=${exportIds.map(encodeURIComponent).join(",")}&format=png&scale=2`,
  );
  if (imagesRes.err) {
    throw new Error(`Figma images error: ${imagesRes.err}`);
  }

  const usedSlugs = new Set<string>();
  const figures: FigureEntry[] = [];

  for (let i = 0; i < detected.length; i++) {
    const d = detected[i];
    const id = d.exportNode.node.id;
    const url = imagesRes.images[id];
    if (!url) {
      console.warn(`No image URL for ${id} (${d.exportNode.node.name}) — skipping`);
      continue;
    }

    const baseSlug =
      d.role === "hero" && slug === "watch-club"
        ? "hero"
        : slugify(d.caption || d.exportNode.node.name || `figure-${i}`);
    const figureSlug = uniqueSlug(baseSlug, usedSlugs);
    const order = figures.length;
    const fileName = `${String(order).padStart(2, "0")}-${id.replace(/:/g, "-")}.png`;
    const imagePath = fileName;
    const dest = path.join(outDir, fileName);

    const imgRes = await fetch(url);
    if (!imgRes.ok) {
      throw new Error(`Download failed for ${id}: ${imgRes.status}`);
    }
    await fs.writeFile(dest, Buffer.from(await imgRes.arrayBuffer()));
    console.log(`Wrote ${fileName}`);

    figures.push({
      order,
      role: d.role,
      figmaNodeId: id,
      slug: figureSlug,
      imagePath,
      caption: d.caption,
      alt: "",
      inset: false,
      videoPath: d.needsVideo ? `videos/${figureSlug}.mp4` : null,
      needsVideo: d.needsVideo,
      anchorText: d.anchorText,
    });
  }

  const manifest: Manifest = {
    slug,
    fileKey,
    frameNodeId: nodeId,
    extractedAt: new Date().toISOString(),
    figures,
  };

  const manifestPath = path.join(outDir, "figures.json");
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nWrote ${manifestPath} (${figures.length} figures)`);

  const neededVideos = figures.filter((f) => f.needsVideo);
  console.log("\n=== Video checklist (drop files next to figures.json) ===");
  if (!neededVideos.length) {
    console.log("(none — no VIDEO fills detected)");
  } else {
    for (const f of neededVideos) {
      console.log(`  [ ] out/${slug}/${f.videoPath}  ← ${f.role} “${f.caption || f.slug}”`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
