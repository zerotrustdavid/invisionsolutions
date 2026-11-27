import { LETTER_I } from "@/lib/wordmark";

/**
 * Invision Solutions brand definition.
 *
 * The logo is the name in lowercase serif, "invision solutions", with one
 * coloured thing in it: the dot over the first i, in the brand blue. One point,
 * one person doing the work. The letters are outlines in `wordmark.ts`.
 *
 * The site has one theme, a light one, so the logo has one set of colours and
 * they are plain values here, not CSS variable references (a renamed variable
 * once silently deleted part of a logo). The same values exist as tokens in
 * globals.css, and `npm run check:contrast` fails if the two copies drift apart.
 */
export const BRAND_COLOURS = {
  /** The dot. A graphic: 3.92:1 on paper, so never used for text. */
  blue: "#2F7BE0",
  /** "invision", and the icon tile. */
  ink: "#0F1B2D",
  /** "solutions". */
  slate: "#46546A",
  paper: "#F6F8FB",
  white: "#FFFFFF",
} as const;

/** Icon tile: corner radius as a fraction of the tile, and how much of it the letter fills. */
export const TILE = { radiusRatio: 0.22, fillRatio: 0.56 } as const;

/**
 * Where to put the letter i (with its dot) inside a square of side `box`, so it
 * is centred and fills `fill` of it. Returns the scale and translation to apply
 * to the letter's own font-unit coordinates.
 */
export function fitLetter(box: number, fill: number) {
  const top = LETTER_I.dot.cy - LETTER_I.dot.r; // negative: above the baseline
  const w = LETTER_I.x1 - LETTER_I.x0;
  const h = -top;
  const s = (box * fill) / Math.max(w, h);
  return {
    s,
    tx: (box - w * s) / 2 - LETTER_I.x0 * s,
    ty: (box - h * s) / 2 - top * s,
  };
}
