import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BRAND_COLOURS } from "@/lib/brand";
import { WORDMARK } from "@/lib/wordmark";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Satori does not apply variable-font axes, so the card loads static files
 * (Newsreader for the headline, IBM Plex Sans for the line beneath) rather than
 * the variable files the site itself uses. Both are licensed under the SIL Open
 * Font License. The logo is drawn from paths and needs no font.
 *
 * Read at build time: this route is prerendered, so process.cwd() is the
 * project root.
 */
const fontDir = join(process.cwd(), "src/app/_fonts");
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
        <svg width={Math.round((66 * WORDMARK.width) / WORDMARK.height)} height={66} viewBox={WORDMARK.viewBox} fill="none">
          <path d={WORDMARK.ink} fill={BRAND_COLOURS.ink} />
          <path d={WORDMARK.slate} fill={BRAND_COLOURS.slate} />
          <circle cx={WORDMARK.dot.cx} cy={WORDMARK.dot.cy} r={WORDMARK.dot.r} fill={BRAND_COLOURS.blue} />
        </svg>

        <div
          style={{
            display: "flex",
            marginTop: 64,
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
        { name: "Newsreader", data: newsreader, weight: 400, style: "normal" },
        { name: "IBM Plex Sans", data: plex, weight: 500, style: "normal" },
      ],
    },
  );
}
