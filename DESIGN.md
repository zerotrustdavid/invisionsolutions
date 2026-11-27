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
IBM Plex Sans for interface: navigation, labels, buttons, form fields. Labels are
sentence case, not tracked capitals. The logo is also Newsreader, but as outlined
paths rather than live text (see below), so it does not depend on the page's font.

**Colour.** Cool paper and a deep blue-black ink, with one chromatic family:
blue. `accent` is the darker blue that is safe to read, used for links, focus
and buttons. `brand` is the logo's blue dot; it passes only as a graphic (3:1), so it is
never used for text. Names are roles (paper,
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

**The logo.** The name in lowercase serif, "invision solutions", with one coloured
thing in it: the dot over the first i, in the brand blue. One point, one person
doing the work. "invision" is ink and "solutions" is slate. The letters are
outlines generated from Newsreader at weight 500 and optical size 24 and live in
`src/lib/wordmark.ts`: that file is generated, so change the logo by
regenerating it, not by editing the numbers. Because they are paths there is no
font to load and the dot cannot drift off the letter.

**The brand colours exist twice, and must agree.** `src/lib/brand.ts` holds them
as plain values (what the logo, icons and social card draw with) and
`globals.css` holds them as tokens (what the page uses). `npm run check:contrast`
fails if they drift apart, if any text or control pairing misses WCAG AA, and if a
`prefers-color-scheme: dark` rule appears. Each guard has been shown to fail on the
fault it exists for.

**Icons.** The favicon and home-screen icon are the first letter, a serif i with its
blue dot, in paper on an ink square. The square is full-bleed and opaque, with no
rounded corners and no transparency, because a platform that crops icons or fills
transparency with white (LinkedIn does) would otherwise show white corners. The
logo spec checks the corner pixels of both icons. A known weakness: an i on a tile also looks like the generic
"information" icon, so the icon leans on the dot colour and the serif letterform to
set it apart. There is no public page of brand files, and none should be added
without being asked.

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
