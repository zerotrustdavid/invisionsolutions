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
IBM Plex Sans for interface: navigation, labels, buttons, form fields. Outfit is
loaded for the wordmark and for nothing else. Labels are sentence case, not
tracked capitals.

**Colour.** Cool paper and a deep blue-black ink, with one chromatic family:
blue. `accent` is the darker blue that is safe to read, used for links, focus
and buttons. `brand` and `brand-deep` are the mark's blue and indigo; they pass
only as graphics (3:1), so they are never used for text. Names are roles (paper,
ink, slate, faint, line, control, accent, danger), so a component never names a
colour and the palette is a change of values in one file.

**One theme, and it is light.** The site has no dark theme and must not get one
back without being asked. `color-scheme: light` is declared so a visitor whose
system is set to dark still gets a light page and light form controls, and
nothing in the stylesheet varies with `prefers-color-scheme`. The owner has said
twice that they do not want the site dark. (An earlier redesign shipped a dark
theme, and it was the one the owner saw whenever their system was set to dark.)

**Buttons** are square-cornered (3px), with one solid call to action per view
and text links for everything else. Links in running text are underlined, never
told apart by colour alone.

**Motion** is limited to colour and underline transitions, and respects
`prefers-reduced-motion`.

## Constraints that outrank taste

**The mark and the wordmark.** The mark is an open hexagon drawn as one line with
a gap on one side, and a dot inside: the view in, and the one person you deal
with. The wordmark is "Invision Solutions" in Outfit, beside it. The type is part
of the logo, so `font-wordmark` must never follow the site's own faces.

**The brand colours exist twice, and must agree.** `src/lib/brand.ts` holds them
as plain values (what the logo, icons and social card draw with) and
`globals.css` holds them as tokens (what the page uses). `npm run check:contrast`
fails if they drift apart, if any text or control pairing misses WCAG AA, and if a
`prefers-color-scheme: dark` rule appears in the stylesheet. Each guard has been
shown to fail on the fault it exists for.

**Icons.** The favicon and the home-screen icon put the mark on a white tile with
a heavier line, because they are read at 16 to 32px and the indigo dot would sink
on a dark tab strip. There is no public page of brand files, and none should be
added without being asked.

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

- `npm run check:contrast`: every text and control pairing, the brand-colour sync between `brand.ts` and the stylesheet, and the absence of any dark-theme rule
- The rendered logo's resolved colours, font and size against the brand spec, with the system set to light and to dark: the page and the logo must be identical
- Axe (WCAG 2.2 AA and best practice) on every page at 390px and 1440px, with the system set to light and to dark
- No horizontal scroll at 320, 390, 768 and 1440px
- Every text block visible with JavaScript disabled
- The form's request to `/api/enquiry`, its payload, the honeypot, and that success is shown only when the route says `ok: true` (including a 200 without it), on all three forms
