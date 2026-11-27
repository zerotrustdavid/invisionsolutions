import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Page furniture.
 *
 * The layout is a running page rather than a stack of banded cards: a narrow
 * left rail carries the name of each section and the content sits in a wide
 * column beside it, separated by hairline rules. Pages vary what goes in the
 * column (rows, columns, prose, a definition list) so the rhythm comes from the
 * content and not from one repeated container.
 */

const WIDTH = "mx-auto w-full max-w-[72rem] px-6 sm:px-10";

function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${WIDTH} ${className}`}>{children}</div>;
}

/**
 * A section with its name in the rail. `label` is plain sentence case: it names
 * the section, it does not decorate it. The rail sticks on wide screens so the
 * name stays beside long content.
 */
function Section({
  label,
  children,
  id,
  className = "",
  rule = true,
}: {
  label?: string;
  children: ReactNode;
  id?: string;
  className?: string;
  rule?: boolean;
}) {
  return (
    <section
      id={id}
      className={`${rule ? "border-t border-line" : ""} ${className}`}
    >
      <div
        className={`${WIDTH} grid gap-x-12 gap-y-5 py-16 sm:py-24 lg:grid-cols-[11rem_minmax(0,1fr)]`}
      >
        <div>
          {label && (
            <p className="t-label lg:sticky lg:top-28">{label}</p>
          )}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

/** A heading block for the top of a page. */
function PageHead({
  title,
  lede,
  children,
}: {
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className={`${WIDTH} pb-16 pt-16 sm:pb-20 sm:pt-24`}>
      <h1 className="t-h1 max-w-[22ch]">{title}</h1>
      {lede && <p className="t-lede mt-7 max-w-[40rem]">{lede}</p>}
      {children}
    </header>
  );
}

const BUTTON =
  "inline-flex items-center gap-2 rounded-[3px] px-5 py-3 font-sans text-[0.9375rem] font-medium leading-none transition-colors";

/** The one solid call to action on a page. */
function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${BUTTON} bg-ink text-paper hover:bg-accent`}
    >
      {children}
    </Link>
  );
}

/** A quieter link that still reads as a link. */
function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="font-sans text-[0.9375rem] font-medium text-ink underline decoration-accent decoration-1 underline-offset-[0.32em] transition-[text-decoration-thickness] hover:decoration-2"
    >
      {children}
      <span aria-hidden="true"> →</span>
    </Link>
  );
}

/**
 * Links that leave the site. Kept separate from the internal variants so
 * `target`/`rel` and the outbound affordance can never be forgotten at a call
 * site. `rel="noopener"` in particular is a security requirement, not a
 * stylistic one: without it the opened page gets a handle on this one via
 * `window.opener`.
 */
function ExternalPrimaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${BUTTON} bg-ink text-paper hover:bg-accent`}
    >
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

function ExternalTextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-sans text-[0.9375rem] font-medium text-ink underline decoration-accent decoration-1 underline-offset-[0.32em] transition-[text-decoration-thickness] hover:decoration-2"
    >
      {children}
      <ArrowUpRight size={15} aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/**
 * A ruled list. Each row is a term on the left and its description on the
 * right, separated from the next by a hairline. Used for services, process and
 * anything else that is a sequence of named things.
 */
function Rows({ children }: { children: ReactNode }) {
  return <div className="border-b border-line">{children}</div>;
}

function Row({
  term,
  children,
  hint,
  as: Heading = "h3",
}: {
  term: ReactNode;
  children: ReactNode;
  hint?: ReactNode;
  /**
   * Heading level for the term. Defaults to h3, which is right when the rows
   * sit under an h2. Use h2 where nothing above them is a section heading, so
   * the outline never skips a level.
   */
  as?: "h2" | "h3";
}) {
  return (
    <div className="grid gap-x-10 gap-y-3 border-t border-line py-8 md:grid-cols-[15rem_minmax(0,1fr)]">
      <div>
        <Heading className="t-h3">{term}</Heading>
        {hint && <p className="t-label mt-2">{hint}</p>}
      </div>
      <div className="t-small !text-[1.0625rem] !leading-[1.7]">{children}</div>
    </div>
  );
}

export {
  Container,
  Section,
  PageHead,
  PrimaryButton,
  TextLink,
  ExternalPrimaryButton,
  ExternalTextLink,
  Rows,
  Row,
  WIDTH,
};
