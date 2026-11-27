import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BRAND_COLOURS, DOOR_PATH, DOT, GRID, STROKE } from "@/lib/brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Satori does not apply variable-font axes, so the card loads static files
 * (Outfit for the wordmark, Newsreader for the headline, IBM Plex Sans for the
 * line beneath) rather than the variable files the site itself uses. All three
 * are licensed under the SIL Open Font License.
 *
 * Read at build time: this route is prerendered, so process.cwd() is the
 * project root.
 */
const fontDir = join(process.cwd(), "src/app/_fonts");
const outfit = readFileSync(join(fontDir, "outfit-400.woff"));
const newsreader = readFileSync(join(fontDir, "newsreader-400.woff"));
const plex = readFileSync(join(fontDir, "ibm-plex-sans-500.woff"));

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
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width={84} height={84} viewBox={`0 0 ${GRID} ${GRID}`} fill="none">
            <path
              d={DOOR_PATH}
              stroke={BRAND_COLOURS.blue}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx={DOT.cx} cy={DOT.cy} r={DOT.r} fill={BRAND_COLOURS.indigo} />
          </svg>
          <div
            style={{
              display: "flex",
              fontFamily: "Outfit",
              fontSize: 54,
              color: BRAND_COLOURS.ink,
              letterSpacing: "0.005em",
            }}
          >
            Invision Solutions
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontFamily: "Newsreader",
            fontSize: 72,
            lineHeight: 1.08,
            color: BRAND_COLOURS.ink,
            maxWidth: 960,
            letterSpacing: "-0.02em",
          }}
        >
          Security consulting, done by the person you hired.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontFamily: "IBM Plex Sans",
            fontSize: 26,
            color: BRAND_COLOURS.slate,
          }}
        >
          Cybersecurity, DevSecOps and cloud architecture
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Outfit", data: outfit, weight: 400, style: "normal" },
        { name: "Newsreader", data: newsreader, weight: 400, style: "normal" },
        { name: "IBM Plex Sans", data: plex, weight: 500, style: "normal" },
      ],
    },
  );
}
