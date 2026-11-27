import { ImageResponse } from "next/og";
import { BRAND_COLOURS, TILE, fitLetter } from "@/lib/brand";
import { LETTER_I } from "@/lib/wordmark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon: the serif i with its blue dot, paper on an ink tile. The tile is what
 * keeps it legible on both a light and a dark tab strip.
 */
export default function Icon() {
  const box = 100;
  const { s, tx, ty } = fitLetter(box, 0.62);
  return new ImageResponse(
    (
      <svg width={32} height={32} viewBox={`0 0 ${box} ${box}`} fill="none">
        <rect width={box} height={box} rx={box * TILE.radiusRatio} fill={BRAND_COLOURS.ink} />
        <g transform={`translate(${tx} ${ty}) scale(${s})`}>
          <path d={LETTER_I.path} fill={BRAND_COLOURS.paper} />
          <circle cx={LETTER_I.dot.cx} cy={LETTER_I.dot.cy} r={LETTER_I.dot.r} fill={BRAND_COLOURS.blue} />
        </g>
      </svg>
    ),
    size,
  );
}
