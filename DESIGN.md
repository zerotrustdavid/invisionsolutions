# Design

This file records the design system and, more usefully, why it is the way it is.
The reasons are what stop the next change putting the old look back.

## What this site is for

A one-person cybersecurity, DevSecOps and cloud consultancy. The visitor is an
engineering or security leader deciding whether to hire one senior person. The
thing that distinguishes the offer is that you deal with the person doing the
work, so the design has to read as written by a person and has to be
believable to someone who audits things for a living.

Surface mode is **persuade**. There is no photography of the founder, and none
has been invented.

## The look it replaced, and why it had to go

The previous design was a stack of recognisable template habits: a monospace
uppercase gold label above every section, equal cards in threes, pill buttons,
alternating white and cream bands, a centred call-to-action card at the end of
each page, a fade-up on every block, and a fake terminal panel ("verification
ledger", "STATUS: VERIFIED"). None of it said anything about this consultancy.
The fake terminal also asserted a verification that was not happening, which is
the wrong thing for a security firm's site to do.

Its worst fault was not aesthetic. The fade-up wrapper shipped 26 blocks with
`opacity:0` in the HTML, so with JavaScript off, or when printing, everything
below the hero was invisible. The redesign has no scroll choreography at all.

## The system

**Editorial, not interface.** A running page with a narrow left rail naming each
section and a wide content column, divided by hairline rules. Rows and columns
of plain text rather than cards. The rhythm comes from varying what sits in the
column (a ruled list, prose, a definition list, labelled rows), not from one
repeated container.

**Type.** Newsreader (serif, with an optical-size axis) for headings and prose;
IBM Plex Sans for interface: navigation, labels, buttons, form fields. Space
Grotesk is loaded for the wordmark and for nothing else. Labels are sentence
case, not tracked capitals.

**Colour.** Warm paper and warm near-black. The only chromatic colour is the
brand gold, used two ways: `gold` as decoration, and `accent` wherever gold must
be read as text or a link, because the brand gold alone is only 2.4:1 on paper.
Names are roles (paper, ink, slate, faint, line, control, accent, danger), so a
component never names a colour and a theme is a change of values in one file.

**Both themes are designed.** The dark theme is warm charcoal, not an
inversion, and `color-scheme: light dark` is declared so the browser knows the
page handles each. (The previous version was light only but was seen rendered
dark in a browser, consistent with something force-darkening it. That could not
be reproduced in the test environment, so this design does not claim to prevent
it, only to look right when the dark scheme is genuinely requested.)

**Buttons** are square-cornered (3px), with one solid call to action per view
and text links for everything else. Links in running text are underlined, never
told apart by colour alone.

**Motion** is limited to colour and underline transitions, and respects
`prefers-reduced-motion`.

## Constraints that outrank taste

**The logo is one version.** No dark colourway, no inverted form. On the dark
theme it sits on a white plate (`.logo-plate`), per the brand's own tile rule,
and its colours are pinned inside that class to `BRAND_COLOURS` in
`src/lib/brand.ts`. Its typeface is `font-wordmark`, which must never follow the
site's display face.

**`brand.ts` reads CSS variables by name.** `MARK_COLOURS.return` is
`var(--color-gold-ink)`. Remove or rename that token and the return stroke
silently vanishes from the logo. This happened during the redesign and was found
by diffing the rendered logo, not by any build step. `npm run check:contrast`
now fails if any variable `brand.ts` reads is undefined, and it has been shown to
fail on the exact original mistake.

**Case study figures, outcomes and sector labels are not design material.** They
are published claims about client results, and whether they have been verified is
an open decision recorded elsewhere. Redesigning a page means restyling how they
are shown, never editing them.

**No invented content.** No client names, testimonials, headshots, logos of
clients, counts or ratings. The testimonials array is empty on purpose.

**Copy rules.** First person singular. British English. No em dashes. Plain
statements over slogans.

## Verification

A visual judgement is not enough for these, because each has already been wrong
once while looking fine:

- `npm run check:contrast`: every text and control pairing in both themes, plus the brand-variable guard
- The rendered logo's resolved colours, font and geometry against the brand spec, in both themes
- Axe (WCAG 2.2 AA and best practice) on every page at 390px and 1440px, both themes
- No horizontal scroll at 320, 390, 768 and 1440px
- Every text block visible with JavaScript disabled
- The form's outbound request, subject line and honeypot, on all three forms
