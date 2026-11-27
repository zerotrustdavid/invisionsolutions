import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import {
  ASPECT,
  BRAND_COLOURS,
  CLOUD_ARC,
  RETURN_ARC,
  STROKE,
  VIEWBOX,
  WORDMARK,
} from "@/lib/brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Satori does not apply variable-font axes, and next/font ships Space Grotesk
 * as a single variable file for all three weights — so without these the card
 * silently fell back to a generic sans and never matched the site's type at
 * all. These are static instances cut from that variable font at 700 and 500.
 *
 * Read at build time: this route is prerendered, so process.cwd() is the
 * project root.
 */
const fontDir = join(process.cwd(), "src/app/_fonts");
const grotesk700 = readFileSync(join(fontDir, "space-grotesk-700.ttf"));
const grotesk500 = readFileSync(join(fontDir, "space-grotesk-500.ttf"));
const plexMono = readFileSync(join(fontDir, "ibm-plex-mono-400.ttf"));

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: BRAND_COLOURS.paper,
          padding: "84px",
          fontFamily: "Space Grotesk",
        }}
      >
        {/* Row lockup. The card is 630px tall and mostly headline, so the
            stacked lockup would crowd it. */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width={72 * ASPECT} height={72} viewBox={VIEWBOX} fill="none">
            {/* Gold line, deep-gold return — the light-tone roles. */}
            <path
              d={CLOUD_ARC}
              stroke={BRAND_COLOURS.gold}
              strokeWidth={STROKE}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={RETURN_ARC}
              stroke={BRAND_COLOURS.goldInk}
              strokeWidth={STROKE}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* The company is Invision Solutions — the card says so, and the
              descriptor is tracked to span the name as it does everywhere. */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 42,
                fontWeight: 700,
                color: BRAND_COLOURS.ink,
              }}
            >
              INVISION
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 42 * WORDMARK.sublineRatio,
                fontWeight: 500,
                letterSpacing: `${WORDMARK.sublineTracking}em`,
                color: BRAND_COLOURS.slate,
                marginTop: 6,
              }}
            >
              SOLUTIONS
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 62,
            lineHeight: 1.1,
            color: BRAND_COLOURS.ink,
            maxWidth: 940,
            letterSpacing: "-0.02em",
          }}
        >
          Security consulting, done by the person you hired.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: BRAND_COLOURS.slate,
            fontFamily: "IBM Plex Mono",
          }}
        >
          Cybersecurity · DevSecOps · Cloud Architecture
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: grotesk700, weight: 700, style: "normal" },
        { name: "Space Grotesk", data: grotesk500, weight: 500, style: "normal" },
        { name: "IBM Plex Mono", data: plexMono, weight: 400, style: "normal" },
      ],
    },
  );
}
