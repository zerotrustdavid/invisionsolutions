import {
  ART,
  ASPECT,
  CLOUD_ARC,
  MARK_COLOURS,
  RETURN_ARC,
  STROKE,
  TILE,
  VIEWBOX,
  WORDMARK,
} from "@/lib/brand";

/**
 * The mark: a cloud drawn as one continuous line, gold silhouette and
 * deep-gold return, on a white field.
 *
 * There is one version. No light/dark colourway, no inverted variant, and no
 * solid stand-in at small sizes — the tile, favicon and app icon all carry
 * this exact artwork on white.
 */
function Artwork() {
  return (
    <>
      <path
        d={CLOUD_ARC}
        stroke={MARK_COLOURS.line}
        strokeWidth={STROKE}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={RETURN_ARC}
        stroke={MARK_COLOURS.return}
        strokeWidth={STROKE}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

/**
 * `size` is the mark's height in pixels. Width follows from the artwork's
 * aspect — the mark is roughly 1.86:1, so never constrain it to a square box.
 * `tile` puts it on a white rounded square for icons and avatars.
 */
function LogoMark({ size = 32, tile = false }: { size?: number; tile?: boolean }) {
  if (tile) {
    const box = 100;
    const w = box * TILE.fillRatio;
    const s = w / ART.width;
    const h = ART.height * s;
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${box} ${box}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          width={box}
          height={box}
          rx={box * TILE.radiusRatio}
          fill={MARK_COLOURS.field}
        />
        <g
          transform={`translate(${(box - w) / 2 - ART.x * s} ${
            (box - h) / 2 - ART.y * s
          }) scale(${s})`}
        >
          <Artwork />
        </g>
      </svg>
    );
  }

  return (
    <svg
      width={size * ASPECT}
      height={size}
      viewBox={VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <Artwork />
    </svg>
  );
}

/**
 * Lockup. Stacked by default — mark over wordmark over a tracked subline.
 * `orientation="row"` puts the mark beside the wordmark for shallow spaces
 * like the nav bar.
 */
function LogoLockup({
  size = 32,
  subline = true,
  orientation = "stacked",
}: {
  size?: number;
  subline?: boolean;
  orientation?: "stacked" | "row";
}) {
  const wordmark = (
    // No negative tracking: uppercase wants neutral or slightly open spacing.
    <span
      className="whitespace-nowrap font-wordmark font-bold text-ink"
      style={{ fontSize: size }}
    >
      INVISION
    </span>
  );
  const sub = subline && (
    <span
      className="whitespace-nowrap font-wordmark uppercase text-slate"
      style={{
        fontSize: size * WORDMARK.sublineRatio,
        fontWeight: 500,
        letterSpacing: `${WORDMARK.sublineTracking}em`,
        // CSS adds letter-spacing after the last glyph too, which would push a
        // centred subline off by half that. Pull the trailing space back so it
        // centres on the name and spans it exactly.
        marginRight: `-${WORDMARK.sublineTracking}em`,
      }}
    >
      Solutions
    </span>
  );

  if (orientation === "row") {
    return (
      <span className="inline-flex items-center gap-2.5">
        <LogoMark size={size * 1.15} />
        <span className="flex flex-col leading-none">
          {wordmark}
          {sub}
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex flex-col items-center leading-none">
      <LogoMark size={size * 1.5} />
      <span style={{ marginTop: size * 0.34 }}>{wordmark}</span>
      {sub && <span style={{ marginTop: size * 0.3 }}>{sub}</span>}
    </span>
  );
}

export { LogoMark, LogoLockup };
