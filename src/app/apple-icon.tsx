import { ImageResponse } from "next/og";
import { BRAND_COLOURS, fitLetter } from "@/lib/brand";
import { LETTER_I } from "@/lib/wordmark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Home-screen icon. iOS rounds the corners itself, so the tile is a plain
 * square, with the same letter and dot as the favicon.
 */
export default function AppleIcon() {
  const box = 100;
  const { s, tx, ty } = fitLetter(box, 0.6);
  return new ImageResponse(
    (
      <svg width={180} height={180} viewBox={`0 0 ${box} ${box}`} fill="none">
        <rect width={box} height={box} fill={BRAND_COLOURS.ink} />
        <g transform={`translate(${tx} ${ty}) scale(${s})`}>
          <path d={LETTER_I.path} fill={BRAND_COLOURS.paper} />
          <circle cx={LETTER_I.dot.cx} cy={LETTER_I.dot.cy} r={LETTER_I.dot.r} fill={BRAND_COLOURS.blue} />
        </g>
      </svg>
    ),
    size,
  );
}
