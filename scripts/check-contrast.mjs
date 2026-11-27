/**
 * Colour-contrast gate.
 *
 * Reads the real token values out of src/app/globals.css, so it checks what
 * ships rather than a copy that can drift, then verifies every text and
 * interface pairing the design relies on. The site has one theme, a light one.
 *
 * It begins with a self-test. A contrast check that has never reported a
 * failure proves nothing when it reports a pass, so two known cases are run
 * first: a pale gold on white, which is about 2.4:1 and must FAIL AA text,
 * and black on white, which must pass. If the checker cannot tell those apart
 * it exits non-zero before looking at the site at all.
 *
 * Exit code 0: every pairing passes. Non-zero: at least one does not, or the
 * self-test failed.
 */
import { readFileSync } from "node:fs";

const CSS = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

function channel(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}
function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
}
function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// ---- Self-test: must be able to fail, and must be able to pass. -------------
const knownBad = ratio("#c9a227", "#ffffff"); // a pale gold on white, ~2.4
const knownGood = ratio("#000000", "#ffffff"); // 21
if (!(knownBad < 3 && knownGood > 20)) {
  console.error(
    `SELF-TEST FAILED: pale gold on white measured ${knownBad.toFixed(2)} and black on white ${knownGood.toFixed(2)}. The checker cannot be trusted.`,
  );
  process.exit(2);
}
console.log(
  `self-test ok: a pale gold on white ${knownBad.toFixed(2)}:1 (fails AA as it must), black on white ${knownGood.toFixed(1)}:1`,
);

// ---- The brand colours in brand.ts must match the tokens in globals.css. -----
// The mark's two colours exist twice: as plain values in src/lib/brand.ts (what
// the logo, icons and social card draw with) and as tokens in the stylesheet
// (what the page uses). If one is edited without the other the site quietly
// carries two different blues. This makes that a hard failure.
function brandMismatches(brandSource, stylesheet) {
  const pairs = [
    ["blue", "brand"],
    ["ink", "ink"],
    ["paper", "paper"],
    ["slate", "slate"],
  ];
  const out = [];
  for (const [constName, tokenName] of pairs) {
    const inBrand = brandSource.match(new RegExp(`\\b${constName}:\\s*"(#[0-9a-fA-F]{6})"`))?.[1];
    const inCss = stylesheet.match(new RegExp(`--color-${tokenName}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
    if (!inBrand || !inCss) out.push(`${constName}/${tokenName}: not found in ${!inBrand ? "brand.ts" : "globals.css"}`);
    else if (inBrand.toLowerCase() !== inCss.toLowerCase()) out.push(`${constName} ${inBrand} in brand.ts but --color-${tokenName} is ${inCss} in globals.css`);
  }
  return out;
}
// Self-test: a mismatch MUST be reported, and a match must not be.
const probeBad = brandMismatches('blue: "#2F7BE0", ink: "#0F1B2D", paper: "#F6F8FB", slate: "#46546A"', "--color-brand: #000000; --color-ink: #0f1b2d; --color-paper: #f6f8fb; --color-slate: #46546a;");
const probeGood = brandMismatches('blue: "#2F7BE0", ink: "#0F1B2D", paper: "#F6F8FB", slate: "#46546A"', "--color-brand: #2f7be0; --color-ink: #0f1b2d; --color-paper: #f6f8fb; --color-slate: #46546a;");
if (probeBad.length !== 1 || probeGood.length !== 0) {
  console.error("SELF-TEST FAILED: the brand-colour sync guard did not tell a mismatch from a match.");
  process.exit(2);
}
const BRAND = readFileSync(new URL("../src/lib/brand.ts", import.meta.url), "utf8");
const drift = brandMismatches(BRAND, CSS);
if (drift.length > 0) {
  for (const d of drift) console.error(`FAIL  brand colours out of sync: ${d}`);
  process.exit(1);
}
console.log("brand colours ok: brand.ts and globals.css agree");

// ---- There must be no dark theme. --------------------------------------------
// The site is light only. A prefers-color-scheme rule in the stylesheet would
// bring a dark theme back for any visitor whose system is set to dark.
if (/prefers-color-scheme\s*:\s*dark/.test(CSS.replace(/\/\*[\s\S]*?\*\//g, ""))) {
  console.error("FAIL  globals.css contains a prefers-color-scheme: dark rule. The site is light only.");
  process.exit(1);
}
console.log("light only ok: no prefers-color-scheme: dark rule in globals.css");

// ---- Read the tokens. -------------------------------------------------------
function tokens(block) {
  const out = {};
  for (const m of block.matchAll(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    out[m[1]] = m[2];
  }
  return out;
}
const lightBlock = CSS.match(/:root\s*{([^}]*)}/)?.[1];
if (!lightBlock) {
  console.error("Could not find the :root block in globals.css.");
  process.exit(2);
}
const THEMES = { light: tokens(lightBlock) };

// [foreground token, background token, minimum ratio, what it is]
const TEXT = 4.5;
const UI = 3;
const PAIRS = [
  ["ink", "paper", 7, "body text on page"],
  ["slate", "paper", TEXT, "secondary text on page"],
  ["faint", "paper", TEXT, "labels on page"],
  ["accent", "paper", TEXT, "links and accent text on page"],
  ["danger", "paper", TEXT, "form error text on page"],
  ["ink", "panel", 7, "text on inset surface"],
  ["slate", "panel", TEXT, "secondary text on inset surface"],
  ["faint", "panel", TEXT, "labels on inset surface"],
  ["accent", "panel", TEXT, "accent text on inset surface"],
  ["paper", "ink", TEXT, "button label on button"],
  ["paper", "accent", TEXT, "button label on hover state"],
  ["control", "paper", UI, "form field border against page"],
  ["control", "panel", UI, "form field border against inset surface"],
];

let failures = 0;
for (const [theme, t] of Object.entries(THEMES)) {
  for (const [fg, bg, min, what] of PAIRS) {
    if (!t[fg] || !t[bg]) {
      console.error(`FAIL  ${theme}: token missing for ${fg}/${bg}`);
      failures++;
      continue;
    }
    const r = ratio(t[fg], t[bg]);
    const ok = r >= min;
    if (!ok) failures++;
    console.log(
      `${ok ? "pass" : "FAIL"}  ${theme.padEnd(5)} ${r.toFixed(2).padStart(5)}:1 (need ${min})  ${what}  [${fg} ${t[fg]} on ${bg} ${t[bg]}]`,
    );
  }
}

// The logo: both words on the page, the dot as a graphic on the page and on the
// icon tile, and the letter on the tile.
for (const [fg, hex, bg, min] of [
  ["wordmark, invision (brand ink)", "#0f1b2d", "#f6f8fb", 7],
  ["wordmark, solutions (brand slate)", "#46546a", "#f6f8fb", TEXT],
  ["dot (brand blue), graphic, on the page", "#2f7be0", "#f6f8fb", UI],
  ["dot (brand blue), graphic, on the icon tile", "#2f7be0", "#0f1b2d", UI],
  ["icon letter (paper) on the icon tile", "#f6f8fb", "#0f1b2d", TEXT],
]) {
  const r = ratio(hex, bg);
  const ok = r >= min;
  if (!ok) failures++;
  console.log(`${ok ? "pass" : "FAIL"}  logo  ${r.toFixed(2).padStart(5)}:1 (need ${min})  ${fg} on ${bg}`);
}

if (failures > 0) {
  console.error(`\n${failures} pairing(s) below threshold.`);
  process.exit(1);
}
console.log("\nAll pairings pass.");
