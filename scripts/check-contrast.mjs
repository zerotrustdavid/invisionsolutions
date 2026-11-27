/**
 * Colour-contrast gate.
 *
 * Reads the real token values out of src/app/globals.css, so it checks what
 * ships rather than a copy that can drift, then verifies every text and
 * interface pairing the design relies on, in both themes.
 *
 * It begins with a self-test. A contrast check that has never reported a
 * failure proves nothing when it reports a pass, so two known cases are run
 * first: the brand gold on white, which is about 2.4:1 and must FAIL AA text,
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
const knownBad = ratio("#c9a227", "#ffffff"); // brand gold on white, ~2.4
const knownGood = ratio("#000000", "#ffffff"); // 21
if (!(knownBad < 3 && knownGood > 20)) {
  console.error(
    `SELF-TEST FAILED: gold on white measured ${knownBad.toFixed(2)} and black on white ${knownGood.toFixed(2)}. The checker cannot be trusted.`,
  );
  process.exit(2);
}
console.log(
  `self-test ok: brand gold on white ${knownBad.toFixed(2)}:1 (fails AA as it must), black on white ${knownGood.toFixed(1)}:1`,
);

// ---- Brand variables must exist. ---------------------------------------------
// src/lib/brand.ts defines the mark's colours as CSS variable REFERENCES
// (MARK_COLOURS.return is "var(--color-gold-ink)"). Rename or drop one of those
// tokens in the stylesheet and nothing fails: the variable resolves to nothing
// and the stroke quietly disappears from the logo. That happened once, during a
// redesign, and was caught only by a pixel diff. This makes it a hard failure.
function missingBrandVars(brandSource, stylesheet) {
  const wanted = [...new Set([...brandSource.matchAll(/var\((--[a-z-]+)\)/g)].map((m) => m[1]))];
  const defined = new Set([...stylesheet.matchAll(/(--[a-z-]+)\s*:/g)].map((m) => m[1]));
  return wanted.filter((name) => !defined.has(name));
}
// Self-test: a variable the stylesheet lacks MUST be reported.
const probe = missingBrandVars('x: "var(--color-does-not-exist)"', "--color-gold: #fff;");
if (probe.length !== 1 || probe[0] !== "--color-does-not-exist") {
  console.error("SELF-TEST FAILED: the brand-variable guard did not detect a missing variable.");
  process.exit(2);
}
const BRAND = readFileSync(new URL("../src/lib/brand.ts", import.meta.url), "utf8");
const missing = missingBrandVars(BRAND, CSS);
if (missing.length > 0) {
  console.error(`FAIL  brand.ts depends on CSS variables that globals.css does not define: ${missing.join(", ")}`);
  console.error("      The mark would render with those strokes or fills missing.");
  process.exit(1);
}
console.log("brand variables ok: every var(--...) that brand.ts reads is defined in globals.css");

// ---- Read the tokens. -------------------------------------------------------
function tokens(block) {
  const out = {};
  for (const m of block.matchAll(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    out[m[1]] = m[2];
  }
  return out;
}
const lightBlock = CSS.match(/:root\s*{([^}]*)}/)?.[1];
const darkBlock = CSS.match(
  /@media \(prefers-color-scheme: dark\)\s*{\s*:root\s*{([^}]*)}/,
)?.[1];
if (!lightBlock || !darkBlock) {
  console.error("Could not find the light and dark :root blocks in globals.css.");
  process.exit(2);
}
const THEMES = { light: tokens(lightBlock), dark: tokens(darkBlock) };

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

// The lockup is pinned to the brand's canonical values (BRAND_COLOURS) on a white field.
for (const [fg, hex, min] of [
  ["wordmark (brand ink)", "#16181d", 7],
  ["descriptor (brand slate)", "#5c6068", TEXT],
  ["mark return stroke (brand deep gold), graphic", "#7e6212", UI],
]) {
  const r = ratio(hex, "#ffffff");
  const ok = r >= min;
  if (!ok) failures++;
  console.log(`${ok ? "pass" : "FAIL"}  logo  ${r.toFixed(2).padStart(5)}:1 (need ${min})  ${fg} on its white plate`);
}

if (failures > 0) {
  console.error(`\n${failures} pairing(s) below threshold.`);
  process.exit(1);
}
console.log("\nAll pairings pass in both themes.");
