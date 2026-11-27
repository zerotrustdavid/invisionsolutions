# Invision Solutions Website

Marketing site for Invision Solutions Ltd, a founder-led cybersecurity, DevSecOps, and cloud consultancy. Built with Next.js (App Router), TypeScript, and Tailwind CSS, deployed on Vercel at invisionsolutions.co.uk.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run check:install-scripts` | Fail if a dependency ships an install script not on the allowlist |
| `npm run test:enquiry` | Test the enquiry validation and the rate limiter |
| `npm run check:contrast` | Fail if any text or control pairing misses WCAG AA in either theme, or if the brand's CSS variables go missing |

## Environment variables

Copy `.env.example` to `.env.local` and fill in the Resend key:

```bash
cp .env.example .env.local
```

Forms post to `/api/enquiry`, which sends each submission by email through Resend. All the configuration is **server-only**: none of it has a `NEXT_PUBLIC_` prefix, nothing reaches the client bundle, and a change in the hosting dashboard applies to the next deployment as usual.

| Variable | Needed | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | A sending-only Resend API key. Without it the form says the message could not be delivered and logs why; it never reports success. |
| `ENQUIRY_FROM` | No | The sender. Must be on a domain verified in Resend. Defaults to `website@` on the site's own domain. |
| `ENQUIRY_TO` | No | Where enquiries go. Defaults to the address the site publishes. |

Deployment and mailbox configuration is documented privately.

`/contact`, `/enquiries` and the testimonial form on `/testimonials` all post to the one route. Each form's subject line is chosen on the server from the form's kind, so mail rules can still tell submissions apart.

There used to be a third-party form service and a public key. Nothing reads `NEXT_PUBLIC_WEB3FORMS_KEY` or any `NEXT_PUBLIC_WEB3FORMS_KEY_*` variable any more. Delete them from the hosting dashboard so a stale one cannot mislead anybody.

### When a submission fails

The form names the cause on screen, so a screenshot is enough to tell them apart:

- **"The message could not be delivered, so nothing was sent"** means the route refused or could not send it: the Resend key is missing or wrong, the sending domain is not verified, or Resend is down. The server log names which, without the visitor's content.
- **"Some of the details were not accepted"** means a field failed the server's checks.
- **"Several messages from this connection"** means the rate limit was reached.
- **"The request did not reach the site"** means the browser could not complete the request.

The form shows success only when the route replies `{ "ok": true }`, which it does only after Resend has returned an id. A bare HTTP 200 is not enough.

`npm run test:enquiry` runs the tests for the rules that decide what may reach the inbox.

## Brand

The mark is a cloud drawn as one continuous line: the stroke traces the silhouette in gold, runs back along the base, then turns inward in deep gold and stops.

There is **one version and no variants**. No dark colourway, no inverted form, and no heavier stand-in at small sizes. The tile, favicon and app icon all carry the same artwork on a white field. On anything other than white or near-white, use the white tile rather than recolouring the mark.

Geometry and colour roles live in `src/lib/brand.ts`, which is the single source for the mark. `src/components/logo.tsx`, `src/app/icon.tsx` and `src/app/opengraph-image.tsx` all draw from it.

`brand.ts` reads the mark's colours as CSS variables (`var(--color-gold-ink)` and others). Renaming or removing one of those tokens in `globals.css` does not fail a build: a stroke simply disappears from the logo. `npm run check:contrast` fails if any variable `brand.ts` reads is undefined. The lockup is pinned to the brand's own colours inside `.logo-plate`, so changing the site's palette or theme cannot recolour it.

The mark and the wordmark are trademarked material. See `LICENSE.md`.

There is no public brand-assets page and no downloadable logo files. There was a `/brand` route serving 15 generated files from `public/brand/`, produced by `scripts/generate-brand-assets.mjs`; the page, the files and the generator have all been removed. Send anyone who needs artwork a file directly.

### Two things worth knowing before editing the lockup

**The descriptor is width-matched.** "SOLUTIONS" is tracked so it spans exactly the width of "INVISION" above it. Size is the lever, not tracking: at 25% of the wordmark it would need 1.28em of tracking to reach that width, which scatters the letters, so it sits at 45% and needs 0.4615em. Both figures are recorded in `WORDMARK` in `src/lib/brand.ts`. They were previously re-solved from real font metrics by the generator, which no longer exists, so the constants are now the only record — check them against rendered output if the wordmark is ever retyped.

**`src/app/_fonts/` exists for the Open Graph image.** `next/font` ships Space Grotesk as a single variable file covering all three weights, and Satori does not apply variable axes, so `ImageResponse` silently falls back to a generic sans. Those three static font instances are loaded explicitly in `src/app/opengraph-image.tsx` to stop that happening. Do not delete them.

## Security headers

`next.config.ts` sets a baseline on every route: Content-Security-Policy, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors`, and HSTS. `poweredByHeader` is off.

The CSP `connect-src` is `'self'`: the forms post to this site's own `/api/enquiry`, so the browser contacts no other origin. Add an origin there only for a reason that can be stated.

HSTS is sent with `max-age` and `includeSubDomains` but deliberately **without `preload`**. Submission to the preload list is effectively irreversible, and the header should not advertise an intent that has not been decided.

## Project structure

Routes, one folder per page under `src/app/`:

`/` · `/services` · `/approach` · `/case-studies` · `/testimonials` · `/enquiries` · `/contact` · `/payreckon` · `/privacy`

Also served: `/sitemap.xml`, `/robots.txt` and `/.well-known/security.txt`. The last carries an `Expires` date computed at build time, 300 days out, so every deployment refreshes it. It lapses only if the site goes about ten months without a redeploy, and tooling treats an expired security.txt as absent.

- `src/app/icon.tsx`, `src/app/opengraph-image.tsx`: favicon and social card, generated at build time
- `src/app/globals.css`: design tokens for both themes, typographic roles, and the logo's pinned colours. See `DESIGN.md`
- `src/components/*`: header, footer, logo, page furniture (`ui.tsx`), social icons, the enquiry form
- `src/lib/brand.ts`: mark geometry, colour roles, wordmark metrics
- `src/lib/content.ts`: services and case study copy, shared between the Home teasers and the full pages
- `src/app/api/enquiry/route.ts`: the one server route; sends form submissions through Resend and is the one place the mail environment is read
- `src/lib/enquiry.ts`: what a submission may contain, how it is checked and what the email looks like. Imports nothing, so `scripts/test-enquiry.mjs` tests it directly
- `src/lib/mailboxes.ts`: the address the site publishes
- `src/lib/metadata.ts`: canonical URL and per-page metadata helper
- `src/lib/payreckon.ts`: PayReckon product copy, with sourcing rules in the file header

## Repository checks

- `.gitleaks.toml` configures the secret scan. It carries a deliberate backstop rule matching any bare UUID literal, because a UUID assigned to an innocuously named constant will not match an identifier-based rule, and bare UUIDs carry too little entropy for generic detectors to flag on their own.
- `scripts/check-install-scripts.mjs` fails the build on any dependency install script not on a reasoned allowlist, where each entry records why it was allowed.
- `scripts/check-contrast.mjs` reads the real tokens from `globals.css` and checks every pairing in both themes. It begins with a self-test (brand gold on white must fail, black on white must pass), so a pass means something.
- `.github/workflows/ci.yml` runs lint, the contrast check, build, the install-script check, and the secret scan on pull requests. It requests `contents: read`, references no secrets, installs with `npm ci --ignore-scripts`, and fetches gitleaks by pinned version verified against a pinned SHA256 rather than trusting a third-party action.

## Licence

All rights reserved. See `LICENSE.md`. The repository is public so the work can be reviewed; it is not offered for reuse.

## Open items

- **Case study figures** are realistic but need checking against the real engagements before this page is treated as final.
- **Trademark clearance** has not been done. A UK IPO search in classes 9 and 42 is worth running before registering the mark.
