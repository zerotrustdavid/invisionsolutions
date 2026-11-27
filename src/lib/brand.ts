/**
 * Invision Solutions brand definition.
 *
 * The mark is an open hexagon drawn as one line with a gap on one side, and a
 * dot inside it: the view in, and the one person you deal with. The line is
 * the brand blue, the dot the deep indigo.
 *
 * The site has one theme, a light one, so the mark has one set of colours and
 * they are plain values here. They are not read from CSS variables, which is
 * what let a mark stroke vanish silently when a token was renamed. The same
 * values exist as tokens in globals.css (`brand`, `brand-deep`), and
 * `npm run check:contrast` fails if the two copies drift apart.
 */

export const BRAND_COLOURS = {
  /** The hexagon line. A graphic: 3.92:1 on paper, so never used for text. */
  blue: "#2F7BE0",
  /** The dot. 8.18:1 on white. */
  indigo: "#4B3FA7",
  ink: "#0F1B2D",
  paper: "#F6F8FB",
  slate: "#46546A",
  /** Icons and tiles put the mark on white. */
  white: "#FFFFFF",
} as const;

/** The mark is drawn on a 64 x 64 grid. */
export const GRID = 64;

/** Pointy-top hexagon, radius 27, centred on the grid. */
const HEX = [0, 1, 2, 3, 4, 5].map((k) => {
  const angle = ((-90 + 60 * k) * Math.PI) / 180;
  return [32 + 27 * Math.cos(angle), 32 + 27 * Math.sin(angle)] as const;
});
const point = ([x, y]: readonly [number, number]) => `${x.toFixed(2)} ${y.toFixed(2)}`;

/**
 * Five of the hexagon's six sides, as one open path. The side that is left out
 * is the upper right, between the top vertex and the next one: the door.
 */
export const DOOR_PATH = `M${point(HEX[1])} L${point(HEX[2])} L${point(HEX[3])} L${point(HEX[4])} L${point(HEX[5])} L${point(HEX[0])}`;

export const STROKE = 6;
/** Heavier for the icon, which is read at 16 to 32px. */
export const STROKE_ICON = 7.5;

export const DOT = { cx: 32, cy: 32, r: 6.5 } as const;
export const DOT_ICON_R = 7.5;

/** Icon tile: corner radius as a fraction of the tile, and how much of it the mark fills. */
export const TILE = { radiusRatio: 0.22, fillRatio: 0.78 } as const;
