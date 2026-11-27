# Invision Solutions website

Marketing site for Invision Solutions Ltd. Next.js App Router, TypeScript,
Tailwind, deployed on Vercel at invisionsolutions.co.uk.

## Read the operational notes first

Operational and security records for this site live in a separate **private**
repository: `zerotrustdavid/invision-security-notes`.

**Read them before starting or resuming work here**, not afterwards to check a
claim. They carry the current state of the mail configuration, which
controls are and are not in force, the working protocol, and a list of the
things that have already gone wrong on this project. That repository's own
`CLAUDE.md` states the protocol in full.

Any report or note produced while working on this site belongs in that
repository, not this one.

**This repository is public.** Nothing about which security controls are or are
not in force goes in here.

## Two things that will break the live site

**A `NEXT_PUBLIC_` change needs a redeploy.** These values are compiled into the
bundle at build time, so changing one in Vercel and reloading shows the old
value, and looks like the change did not save.

**Forms must never report a success they did not achieve.** The form shows
success only when `/api/enquiry` answers `{ "ok": true }`, and the route answers
that only after Resend has returned an id. A form that said "sent" while nothing
arrived is the failure this project has already had, so do not weaken either end
of that, and do not treat a bare HTTP 200 as success.

## Load-bearing configuration

`src/app/api/enquiry/route.ts` is the one place the mail environment is read
(`RESEND_API_KEY`, `ENQUIRY_FROM`, `ENQUIRY_TO`), all server-only. Never give
any of them a `NEXT_PUBLIC_` prefix: that would compile the value into the
bundle. Do not reintroduce a `?? FALLBACK` chain of keys: that pattern let a
broken key hide behind a working one and is how `/contact` failed in August.

The CSP `connect-src` is `'self'` because the forms post to the site's own
route. Adding an origin widens where injected script could send data.

`npm run test:enquiry` tests the rules that decide what may reach the inbox.
Run it after touching `src/lib/enquiry.ts`.

## Design

`DESIGN.md` records the design system and the reasons for it. Read it before
changing how the site looks. Two things in it are easy to break and give no
build error when broken:

- **The logo reads CSS variables by name.** `src/lib/brand.ts` defines the mark's
  colours as `var(--color-gold-ink)` and friends. Remove or rename one of those
  tokens in `globals.css` and a stroke silently disappears from the logo.
  `npm run check:contrast` fails if any variable `brand.ts` reads is undefined.
- **The lockup is pinned to the brand's own colours** inside `.logo-plate`, and
  its typeface is `font-wordmark`. Neither follows the site's palette or its
  display face, because the mark is one version with no variants.

Do not edit case study figures, outcomes or sector labels as part of a design
change. They are published claims, not design material.

## Conventions

- No `Co-Authored-By` trailer and no "Generated with Claude Code" anywhere in this repository, including pull request bodies. A PR body must be updated immediately after creation, because the footer is appended server-side on create.
- British English. No em dashes. No invented clients, testimonials or figures.
