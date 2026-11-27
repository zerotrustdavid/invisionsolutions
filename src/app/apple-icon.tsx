import { ImageResponse } from "next/og";
import { BRAND_COLOURS, DOOR_PATH, DOT, DOT_ICON_R, GRID, STROKE_ICON } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Home-screen icon. iOS rounds the corners itself, so the tile is a plain
 * square, and the mark sits on white at the same proportions as the favicon.
 */
export default function AppleIcon() {
  const scale = 0.74;
  const offset = (GRID - GRID * scale) / 2;
  return new ImageResponse(
    (
      <svg width={180} height={180} viewBox={`0 0 ${GRID} ${GRID}`} fill="none">
        <rect width={GRID} height={GRID} fill={BRAND_COLOURS.white} />
        <g transform={`translate(${offset} ${offset}) scale(${scale})`}>
          <path
            d={DOOR_PATH}
            stroke={BRAND_COLOURS.blue}
            strokeWidth={STROKE_ICON}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={DOT.cx} cy={DOT.cy} r={DOT_ICON_R} fill={BRAND_COLOURS.indigo} />
        </g>
      </svg>
    ),
    size,
  );
}
