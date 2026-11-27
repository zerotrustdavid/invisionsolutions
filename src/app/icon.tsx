import { ImageResponse } from "next/og";
import { BRAND_COLOURS, fitLetter } from "@/lib/brand";
import { LETTER_I } from "@/lib/wordmark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon: the serif i with its blue dot, paper on an ink square. The square is
 * full-bleed and opaque, with no rounded corners and no transparency, so a
 * platform that crops it to a circle or fills transparency with white (LinkedIn
 * does) never shows white corners. It also keeps the icon legible on both a light
 * and a dark tab strip.
 */
export default function Icon() {
  const box = 100;
  const { s, tx, ty } = fitLetter(box, 0.62);
  return new ImageResponse(
    (
      <svg width={32} height={32} viewBox={`0 0 ${box} ${box}`} fill="none">
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
