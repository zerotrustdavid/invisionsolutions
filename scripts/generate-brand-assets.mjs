/**
 * Generates the downloadable brand assets in public/brand/.
 *
 * Run with: npm run brand
 *
 * Wordmark type is converted to outlines rather than left as <text>, so the
 * SVGs render identically on machines that do not have Space Grotesk or IBM
 * Plex Mono installed. The fonts are read from the webfont files Next.js has
 * already downloaded into .next/static/media, so `next build` must have run at
 * least once before this script.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as fontkit from "fontkit";
import * as wawoff2 from "wawoff2";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "brand");
const TMP = join(ROOT, ".next", "cache", "brand-fonts");

const GOLD = "#C9A227";
const GOLD_INK = "#7E6212";
const INK = "#16181D";
const PAPER = "#FFFFFF";
const SLATE = "#5C6068";

// Geometry — keep in sync with src/lib/brand.ts
const CLOUD_ARC = "M30 70 A14 14 0 0 1 30 42 A20 20 0 0 1 68 34 A16 16 0 0 1 96 44 A13 13 0 0 1 96 70";
const RETURN_ARC = "M96 70 L46 70 A11 11 0 0 1 46 48 A9 9 0 0 1 62 53";
const STROKE = 5.5;
const ART = { x: 13.2, y: 19.9, width: 98.6, height: 52.9 };
const VIEWBOX = `${ART.x} ${ART.y} ${ART.width} ${ART.height}`;
const TILE = { radiusRatio: 0.22, fillRatio: 0.66 };
const CAP_RATIO = 0.7;
// Descriptor sizing/tracking — mirrors WORDMARK in src/lib/brand.ts.
const SUBLINE_RATIO = 0.45;

const ln = (d, c, w) =>
  `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

/**
 * The mark: gold line, deep-gold return. One colourway, no tone variants —
 * the tile and favicon put this exact artwork on white rather than inverting
 * it or swapping in a solid form. Keep in sync with MARK_COLOURS in
 * src/lib/brand.ts.
 */
const markInner = () =>
  `  ${ln(CLOUD_ARC, GOLD, STROKE)}\n  ${ln(RETURN_ARC, GOLD_INK, STROKE)}`;

/**
 * Find a Next-downloaded webfont by the font family it declares.
 *
 * Resolved from the CSS *content* rather than the CSS filename, and from the
 * `@font-face` block's own `url()` rather than an assumed media directory.
 * Both of those were previously assumed and both assumptions were wrong:
 *
 *   - Next emits ONE hash-named stylesheet carrying every family. Matching a
 *     filename against a module name like "space_grotesk" never hits, because
 *     no filename contains it; the module name survives only inside the file,
 *     in generated class names.
 *   - The `url()` values are UNQUOTED, `url(../media/x.woff2)`. A pattern
 *     requiring `url("...")` matches nothing.
 *
 * Neither was caused by a framework upgrade. Both hold on 16.2.12 and 16.3.3.
 *
 * The path resolves relative to the stylesheet that declares it, because
 * `../media/` means different things from `.next/static/chunks` and
 * `.next/dev/static/chunks`; hardcoding the production path pointed the dev
 * branch at a file that need not exist.
 */
function findWoff2(family) {
  const chunkDirs = [
    join(ROOT, ".next", "dev", "static", "chunks"),
    join(ROOT, ".next", "static", "chunks"),
  ];

  // Kept for the error message. A diagnostic that cannot say what it looked at
  // is how the previous version came to advise running a build that had
  // already succeeded.
  const searched = [];
  const familiesSeen = new Set();

  for (const dir of chunkDirs) {
    let files;
    try {
      files = readdirSync(dir);
    } catch {
      searched.push(`${dir} (absent)`);
      continue;
    }
    const stylesheets = files.filter((f) => f.endsWith(".css"));
    searched.push(`${dir} (${stylesheets.length} stylesheet(s))`);

    for (const sheet of stylesheets) {
      const text = readFileSync(join(dir, sheet), "utf8");
      for (const block of text.split("@font-face").slice(1)) {
        const declared = block.match(/font-family:\s*([^;}]+)/);
        if (!declared) continue;
        const name = declared[1].trim().replace(/^["']|["']$/g, "");
        familiesSeen.add(name);
        if (name !== family) continue;

        // `U+??` is the latin subset. The other blocks are Cyrillic, Greek and
        // Vietnamese subsets, carrying none of the glyphs the wordmark uses.
        const range = block.match(/unicode-range:\s*([^;}]+)/);
        if (!range || !range[1].includes("U+??")) continue;

        // Quoted or unquoted, both accepted.
        const url = block.match(/url\(\s*["']?([^"')]+)["']?\s*\)/);
        if (!url) continue;

        return resolve(dir, url[1].trim());
      }
    }
  }

  throw new Error(
    `Could not locate the webfont for font-family "${family}".\n` +
      `Searched:\n  ${searched.join("\n  ")}\n` +
      `Families declared there: ` +
      `${familiesSeen.size ? [...familiesSeen].sort().join(", ") : "(none)"}\n` +
      `A latin (U+??) @font-face block with a url() is required. If the list ` +
      `above is empty, run \`npm run build\` first. If it names families but ` +
      `not this one, the font configuration in src/app/layout.tsx has changed.`,
  );
}

async function loadFontAsync(family, label) {
  mkdirSync(TMP, { recursive: true });
  const ttfPath = join(TMP, `${label}.ttf`);
  const woff2 = readFileSync(findWoff2(family));
  const ttf = await wawoff2.decompress(woff2);
  writeFileSync(ttfPath, Buffer.from(ttf));
  return fontkit.openSync(ttfPath);
}

/**
 * Lay out a string and return outlined path data plus its advance width,
 * both expressed at the requested font size.
 */
function outline(font, text, fontSize, { letterSpacing = 0 } = {}) {
  const scale = fontSize / font.unitsPerEm;
  const run = font.layout(text);
  let x = 0;
  const parts = [];
  run.glyphs.forEach((glyph, i) => {
    const d = glyph.path
      .scale(scale, -scale) // flip: font Y is up, SVG Y is down
      .translate(x, 0)
      .toSVG();
    if (d) parts.push(d);
    x += run.positions[i].xAdvance * scale + letterSpacing;
  });
  return { d: parts.join(" "), width: x - letterSpacing };
}

/** Bare mark, cropped to the artwork so the SVG's box is the visible mark. */
function markSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ART.width}" height="${ART.height}" viewBox="${VIEWBOX}" fill="none">
${markInner()}
</svg>`;
}

/** Square tile — the mark on a white field, for icons and avatars. */
function tileSvg() {
  const box = 100;
  const w = box * TILE.fillRatio;
  const s = w / ART.width;
  const h = ART.height * s;
  const dx = (box - w) / 2 - ART.x * s;
  const dy = (box - h) / 2 - ART.y * s;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${box}" height="${box}" viewBox="0 0 ${box} ${box}" fill="none">
  <rect width="${box}" height="${box}" rx="${box * TILE.radiusRatio}" fill="${PAPER}"/>
  <g transform="translate(${dx.toFixed(3)} ${dy.toFixed(3)}) scale(${s.toFixed(5)})">
${markInner()}
  </g>
</svg>`;
}

/** Favicon. The white tile — the field is what holds it on a dark tab strip. */
function faviconSvg() {
  return tileSvg();
}

/**
 * Wordmark: the full company name set as type, for places that already carry
 * the mark. It includes the descriptor — a letterhead or an email signature
 * using this should still read "Invision Solutions", not just "Invision".
 */
function wordmarkSvg({ display, displayMid }) {
  const SIZE = 100;
  const w = outline(display, "INVISION", SIZE);
  const subSize = SIZE * SUBLINE_RATIO;
  const natural = outline(displayMid, "SOLUTIONS", subSize).width;
  const ls = (w.width - natural) / ("SOLUTIONS".length - 1);
  const sub = outline(displayMid, "SOLUTIONS", subSize, { letterSpacing: ls });
  const cap = SIZE * CAP_RATIO;
  const gapSub = SIZE * 0.22;
  const pad = 16;
  const W = Math.round(Math.max(w.width, sub.width) + pad * 2);
  const H = Math.round(cap + gapSub + subSize + pad * 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none">
  <g transform="translate(${((W - w.width) / 2).toFixed(3)} ${pad + cap})"><path d="${w.d}" fill="${INK}"/></g>
  <g transform="translate(${((W - sub.width) / 2).toFixed(3)} ${(pad + cap + gapSub + subSize).toFixed(3)})"><path d="${sub.d}" fill="${SLATE}"/></g>
</svg>`;
}

/** Stacked lockup: mark over wordmark over a tracked subline, all centred. */
function lockupSvg({ display, displayMid }) {
  const SIZE = 100;
  const w = outline(display, "INVISION", SIZE);
  // Track the descriptor so it spans the name exactly. Solved here from the
  // real advance widths rather than using the constant, so the two can never
  // drift apart if the face changes.
  const subSize = SIZE * SUBLINE_RATIO;
  const natural = outline(displayMid, "SOLUTIONS", subSize).width;
  const ls = (w.width - natural) / ("SOLUTIONS".length - 1);
  const sub = outline(displayMid, "SOLUTIONS", subSize, { letterSpacing: ls });
  const cap = SIZE * CAP_RATIO;

  const markH = SIZE * 1.05;
  const markS = markH / ART.height;
  const markW = ART.width * markS;

  const gapMark = SIZE * 0.34;
  const gapSub = SIZE * 0.22;
  const pad = 20;
  const W = Math.round(Math.max(markW, w.width, sub.width) + pad * 2);
  const H = Math.round(markH + gapMark + cap + gapSub + subSize + pad * 2);

  const markY = pad;
  const wordBase = markY + markH + gapMark + cap;
  const subBase = wordBase + gapSub + subSize;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none">
  <g transform="translate(${((W - markW) / 2 - ART.x * markS).toFixed(3)} ${(markY - ART.y * markS).toFixed(3)}) scale(${markS.toFixed(5)})">
${markInner()}
  </g>
  <g transform="translate(${((W - w.width) / 2).toFixed(3)} ${wordBase.toFixed(3)})"><path d="${w.d}" fill="${INK}"/></g>
  <g transform="translate(${((W - sub.width) / 2).toFixed(3)} ${subBase.toFixed(3)})"><path d="${sub.d}" fill="${SLATE}"/></g>
</svg>`;
}

async function png(svg, file, width, height) {
  const opts = height ? { width, height } : { width };
  await sharp(Buffer.from(svg)).resize(opts).png({ compressionLevel: 9 }).toFile(join(OUT, file));
}

const main = async () => {
  mkdirSync(OUT, { recursive: true });
  const grotesk = await loadFontAsync("Space Grotesk", "space-grotesk");
  const display = grotesk.getVariation({ wght: 700 });
  // The descriptor is set in the display face at 500, not the mono — a tracked
  // monospace reads as a code label rather than part of the name.
  const displayMid = grotesk.getVariation({ wght: 500 });

  const written = [];
  const write = (name, content) => {
    writeFileSync(join(OUT, name), content);
    written.push(name);
  };

  // ---- Icon -------------------------------------------------------------
  const icon = markSvg();
  const tile = tileSvg();
  write("invision-icon.svg", icon);
  write("invision-icon-square.svg", tile);
  write("invision-favicon.svg", faviconSvg());
  for (const px of [2048, 1024, 512, 256]) {
    // Width only — the mark is ~1.86:1, and forcing it square would crop or
    // stretch it. Only the tile below is genuinely square.
    await png(icon, `invision-icon-${px}.png`, px);
    written.push(`invision-icon-${px}.png`);
  }
  for (const px of [1024, 512, 256]) {
    await png(tile, `invision-icon-square-${px}.png`, px, px);
    written.push(`invision-icon-square-${px}.png`);
  }

  // ---- Wordmark ---------------------------------------------------------
  const wm = wordmarkSvg({ display, displayMid });
  write("invision-wordmark.svg", wm);
  await png(wm, "invision-wordmark-2048.png", 2048);
  written.push("invision-wordmark-2048.png");

  // ---- Full lockup ------------------------------------------------------
  const lock = lockupSvg({ display, displayMid });
  write("invision-logo.svg", lock);
  for (const px of [4096, 2048]) {
    await png(lock, `invision-logo-${px}.png`, px);
    written.push(`invision-logo-${px}.png`);
  }

  console.log(`Wrote ${written.length} files to public/brand/`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
