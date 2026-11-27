import { BRAND_COLOURS, DOOR_PATH, DOT, GRID, STROKE } from "@/lib/brand";

/**
 * The mark: an open hexagon with a dot inside. One version, on the light theme.
 * `size` is its height and width in pixels.
 */
function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${GRID} ${GRID}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d={DOOR_PATH}
        stroke={BRAND_COLOURS.blue}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={DOT.cx} cy={DOT.cy} r={DOT.r} fill={BRAND_COLOURS.indigo} />
    </svg>
  );
}

/**
 * The lockup: mark beside the full name. The name is set in the wordmark face,
 * which is deliberately separate from the site's own type so the logo does not
 * move when the typography does.
 */
function LogoLockup({ size = 20 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size * 1.55} />
      <span
        className="whitespace-nowrap font-wordmark text-ink"
        style={{ fontSize: size, fontWeight: 400, letterSpacing: "0.005em", lineHeight: 1 }}
      >
        Invision Solutions
      </span>
    </span>
  );
}

export { LogoMark, LogoLockup };
