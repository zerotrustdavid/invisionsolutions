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
| `npm run brand` | Regenerate the downloadable brand assets (run `build` first) |

## Environment variables

Copy `.env.example` to `.env.local` and fill in the Web3Forms access keys:

```bash
cp .env.example .env.local
```

Without a key set, the form reports that it is not configured rather than submitting.

Web3Forms access keys are **publishable, not secret**. They are prefixed `NEXT_PUBLIC_`, inlined into the client bundle at build time, and readable by anyone viewing source on the deployed site. Keeping them out of the source tree is hygiene, not confidentiality. Because they are inlined at build time, changing one in the hosting dashboard has no effect on a deployment that already exists: every environment carrying a form needs a rebuild, not just a variable update.

Deployment and mailbox configuration is documented privately.

### When a submission fails

Three unrelated causes used to produce one identical message, which made a failure report carry no information. The form now names the cause on screen, so a screenshot is enough to tell them apart without asking anyone to open a browser console:

- **"not configured on this deployment"** means the build received no access key, so nobody can submit.
- **"is not a valid key"** means a value arrived that is not a UUID, so the variable did not reach the build intact. The form stops before the network call rather than sending a request that could only fail.
- **"the form service rejected it: ..."** means the request reached the service and it declined. Its own message names the reason.
- **"could not be reached"** means the request never arrived, which is why this one can fail for a single visitor while working for everyone else.

The distinction between the last two is that `fetch` only rejects when the request did not complete; a rejection by the service resolves normally. Both previously landed in the same branch.

## Brand

The mark is a cloud drawn as one continuous line: the stroke traces the silhouette in gold, runs back along the base, then turns inward in deep gold and stops.

There is **one version and no variants**. No dark colourway, no inverted form, and no heavier stand-in at small sizes. The tile, favicon and app icon all carry the same artwork on a white field. On anything other than white or near-white, use the white tile rather than recolouring the mark.

Geometry and colour roles live in `src/lib/brand.ts` and are mirrored in `scripts/generate-brand-assets.mjs`. Change both together.

The mark and the wordmark are trademarked material. See `LICENSE.md`.

### Regenerating the downloadable files

```bash
npm run build   # must run first; the generator reads Next's webfont files
npm run brand
```

This writes 15 files to `public/brand/`, surfaced on `/brand`. Wordmark type is converted to outlines so the SVGs render correctly without Space Grotesk installed.

### Two things worth knowing before editing the lockup

**The descriptor is width-matched.** "SOLUTIONS" is tracked so it spans exactly the width of "INVISION" above it. Size is the lever, not tracking: at 25% of the wordmark it would need 1.28em of tracking to reach that width, which scatters the letters, so it sits at 45% and needs 0.4615em. The generator re-solves the value from real font metrics rather than reading the constant, so the two cannot drift apart. Both figures are recorded in `WORDMARK` in `src/lib/brand.ts`.

**`src/app/_fonts/` exists for the Open Graph image.** `next/font` ships Space Grotesk as a single variable file covering all three weights, and Satori does not apply variable axes, so `ImageResponse` silently falls back to a generic sans. Those three static font instances are loaded explicitly in `src/app/opengraph-image.tsx` to stop that happening. Do not delete them.

## Security headers

`next.config.ts` sets a baseline on every route: Content-Security-Policy, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors`, and HSTS. `poweredByHeader` is off.

The CSP `connect-src` must allow `https://api.web3forms.com`. Every form on the site posts there from the browser, so narrowing that directive silently breaks lead capture on `/contact`, `/enquiries` and `/testimonials` at once. A build will not catch it.

HSTS is sent with `max-age` and `includeSubDomains` but deliberately **without `preload`**. Submission to the preload list is effectively irreversible, and the header should not advertise an intent that has not been decided.

## Project structure

Routes, one folder per page under `src/app/`:

`/` · `/services` · `/approach` · `/case-studies` · `/testimonials` · `/enquiries` · `/contact` · `/brand` · `/payreckon`

- `src/app/icon.tsx`, `src/app/opengraph-image.tsx`: favicon and social card, generated at build time
- `src/app/globals.css`: design tokens (colour, font, focus states) as CSS custom properties, mapped into Tailwind's `@theme`
- `src/components/*`: header, footer, logo, surface primitives, verification-ledger motif, scroll-reveal wrapper, social icons, Web3Forms form
- `src/lib/brand.ts`: mark geometry, colour roles, wordmark metrics
- `src/lib/content.ts`: services and case study copy, shared between the Home teasers and the full pages
- `src/lib/mailboxes.ts`: the department mailboxes behind `/enquiries`
- `src/lib/metadata.ts`: canonical URL and per-page metadata helper
- `src/lib/payreckon.ts`: PayReckon product copy, with sourcing rules in the file header

## Repository checks

- `.gitleaks.toml` configures the secret scan. It carries a deliberate backstop rule matching any bare UUID literal, because a UUID assigned to an innocuously named constant will not match an identifier-based rule, and bare UUIDs carry too little entropy for generic detectors to flag on their own.
- `scripts/check-install-scripts.mjs` fails the build on any dependency install script not on a reasoned allowlist, where each entry records why it was allowed.
- `.github/workflows/ci.yml` runs lint, build, the install-script check, and the secret scan on pull requests. It requests `contents: read`, references no secrets, installs with `npm ci --ignore-scripts`, and fetches gitleaks by pinned version verified against a pinned SHA256 rather than trusting a third-party action.

## Licence

All rights reserved. See `LICENSE.md`. The repository is public so the work can be reviewed; it is not offered for reuse.

## Open items

- **Case study figures** are realistic but need checking against the real engagements before this page is treated as final.
- **Trademark clearance** has not been done. A UK IPO search in classes 9 and 42 is worth running before registering the mark.
