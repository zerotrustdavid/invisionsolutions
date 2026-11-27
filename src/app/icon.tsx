import { ImageResponse } from "next/og";
import { BRAND_COLOURS, DOOR_PATH, DOT, DOT_ICON_R, GRID, STROKE_ICON, TILE } from "@/lib/brand";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon: the mark on a white tile, with a heavier line than the logo because
 * it is read at 16 to 32px. The white field keeps it legible on a dark tab
 * strip, where the indigo dot would otherwise sink.
 */
export default function Icon() {
  const scale = TILE.fillRatio;
  const offset = (GRID - GRID * scale) / 2;
  return new ImageResponse(
    (
      <svg width={32} height={32} viewBox={`0 0 ${GRID} ${GRID}`} fill="none">
        <rect width={GRID} height={GRID} rx={GRID * TILE.radiusRatio} fill={BRAND_COLOURS.white} />
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
