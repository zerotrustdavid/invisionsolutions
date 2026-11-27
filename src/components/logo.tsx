import { BRAND_COLOURS, TILE, fitLetter } from "@/lib/brand";
import { LETTER_I, WORDMARK } from "@/lib/wordmark";

/**
 * The lockup: "invision solutions" in lowercase serif, with the dot over the
 * first i in the brand blue. Drawn as paths, so it needs no font and the dot
 * cannot drift. Size it with the height: pass a class such as `h-7`.
 */
function LogoLockup({ className = "h-7" }: { className?: string }) {
  return (
    <svg
      viewBox={WORDMARK.viewBox}
      className={`${className} w-auto`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d={WORDMARK.ink} fill={BRAND_COLOURS.ink} />
      <path d={WORDMARK.slate} fill={BRAND_COLOURS.slate} />
      <circle
        cx={WORDMARK.dot.cx}
        cy={WORDMARK.dot.cy}
        r={WORDMARK.dot.r}
        fill={BRAND_COLOURS.blue}
      />
    </svg>
  );
}

/**
 * The mark: the first letter alone, a serif i with its blue dot. On a tile it is
 * the icon form, ink with a paper letter, for avatars and app icons.
 */
function LogoMark({ size = 32, tile = false }: { size?: number; tile?: boolean }) {
  const box = 100;
  const { s, tx, ty } = fitLetter(box, tile ? TILE.fillRatio : 0.92);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${box} ${box}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {tile && (
        <rect width={box} height={box} fill={BRAND_COLOURS.ink} />
      )}
      <g transform={`translate(${tx} ${ty}) scale(${s})`}>
        <path d={LETTER_I.path} fill={tile ? BRAND_COLOURS.paper : BRAND_COLOURS.ink} />
        <circle
          cx={LETTER_I.dot.cx}
          cy={LETTER_I.dot.cy}
          r={LETTER_I.dot.r}
          fill={BRAND_COLOURS.blue}
        />
      </g>
    </svg>
  );
}

export { LogoLockup, LogoMark };
