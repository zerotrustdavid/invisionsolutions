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
| `npm run brand` | Regenerate the downloadable brand assets (run `build` first) |

## Environment variables

Copy `.env.example` to `.env.local` and fill in the Web3Forms access key:

```bash
cp .env.example .env.local
```

Without a key set, the form submits but Web3Forms rejects the request server-side.

### Getting the access key

Web3Forms is account-based. Sign up at [web3forms.com](https://web3forms.com); a form and an access key are created immediately, shown in the dashboard under **Form Setup**. The key is public by design, so it is safe in client-side code, which is why it uses the `NEXT_PUBLIC_` prefix.

### Pointing submissions at the right inbox

The account's signup address is set as the default recipient, so this needs changing explicitly:

1. Sidebar → **Linked Emails** → add the destination address
2. Verify it via the email Web3Forms sends **to that address**
3. Form → **Settings → Email Configuration → Recipient Emails** → add the verified address, remove the signup default
4. **Save Settings**

An address must be verified under Linked Emails before it can be selected as a recipient.

### Plan and key handling

The account is on Web3Forms Pro (10,000 submissions/month).

Access keys are public by design and ship in the client bundle. They can only ever deliver to the verified recipients on the account, so exposure is not the risk. Unrestricted reuse of a key on another site is, which Pro's **Settings → Security Settings → Restrict to Domains** prevents. Keep it set to `invisionsolutions.co.uk, www.invisionsolutions.co.uk` on every form.

Domain restriction also blocks Vercel preview deployments (`*.vercel.app`); add that host temporarily if a preview needs to submit.

If a key is ever abused, rotate it in the dashboard and update the matching Vercel environment variable.

**Whitespace warning.** `NEXT_PUBLIC_` values are inlined at build time, and a stray tab or space pasted into the Vercel field travels with the key into the bundle. Web3Forms then rejects every submission with no useful error. `src/components/web3forms.tsx` trims the key defensively and logs an explicit console error when it is missing, but the value in Vercel should still be clean.

### Routing enquiries to different mailboxes

`/enquiries` sends each department's form to its own mailbox. Web3Forms binds one access key to one form, and recipients are configured per form in the dashboard, so there is no client-side recipient override. Each mailbox therefore needs its own Web3Forms form:

1. Create a form in Web3Forms per mailbox. The current set is defined in `src/lib/mailboxes.ts`: sales, contact, support, billing, invoice, admin, hello.
2. Set that form's recipient to the matching verified address.
3. Copy its access key into the matching `NEXT_PUBLIC_WEB3FORMS_KEY_*` variable in Vercel. See `.env.example` for the full list.
4. Redeploy, because `NEXT_PUBLIC_` values are inlined at build time.

Any variable left unset falls back to `NEXT_PUBLIC_WEB3FORMS_KEY`. The page therefore works before those forms exist and gets more precise as each key is added, and nothing is silently dropped. Each submission carries a distinct subject line, so mail rules can separate them even while everything shares one key.

### Testing submissions

The forms submit client-side from the browser, which is the path the site actually uses, so test them on the deployed site.

Server-side calls to the API (curl, scripts, CI) are rejected with *"This method is not allowed... Pro plan is required"* unless the calling IP is whitelisted by Web3Forms support. That restriction applies only to non-browser callers and never affects the website forms.

### When a submission fails

The form names the cause on screen, so a screenshot of the failure is enough to tell these apart without asking anyone to open a browser console:

- **"not configured on this deployment"** means the build has no access key, so nobody can submit. Check the Vercel environment variable, then **redeploy**, because `NEXT_PUBLIC_` values are inlined at build time.
- **"the form service rejected it: ..."** means the request reached Web3Forms and it declined. Its own message names the reason: domain restriction, quota, or an unverified recipient.
- **"could not be reached"** means the request never arrived. A privacy or ad blocker blocking `api.web3forms.com` is the usual cause, which is why this one can fail for a single visitor while working for everyone else.

To confirm a key actually made it into the deployed bundle, which the page HTML will not show because the key lives in a JS chunk:

```bash
curl -s https://www.invisionsolutions.co.uk/contact \
  | grep -oE '/_next/static/chunks/[^"]+\.js' | sort -u \
  | while read -r p; do curl -s "https://www.invisionsolutions.co.uk$p"; done \
  | grep -oiE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | sort -u
```

No output means no key reached the build.

## Brand

The mark is a cloud drawn as one continuous line: the stroke traces the silhouette in gold, runs back along the base, then turns inward in deep gold and stops.

There is **one version and no variants**. No dark colourway, no inverted form, and no heavier stand-in at small sizes. The tile, favicon and app icon all carry the same artwork on a white field. On anything other than white or near-white, use the white tile rather than recolouring the mark.

Geometry and colour roles live in `src/lib/brand.ts` and are mirrored in `scripts/generate-brand-assets.mjs`. Change both together.

### Regenerating the downloadable files

```bash
npm run build   # must run first; the generator reads Next's webfont files
npm run brand
```

This writes 15 files to `public/brand/`, surfaced on `/brand`. Wordmark type is converted to outlines so the SVGs render correctly without Space Grotesk installed.

### Two things worth knowing before editing the lockup

**The descriptor is width-matched.** "SOLUTIONS" is tracked so it spans exactly the width of "INVISION" above it. Size is the lever, not tracking: at 25% of the wordmark it would need 1.28em of tracking to reach that width, which scatters the letters, so it sits at 45% and needs 0.4615em. The generator re-solves the value from real font metrics rather than reading the constant, so the two cannot drift apart. Both figures are recorded in `WORDMARK` in `src/lib/brand.ts`.

**`src/app/_fonts/` exists for the Open Graph image.** `next/font` ships Space Grotesk as a single variable file covering all three weights, and Satori does not apply variable axes, so `ImageResponse` silently falls back to a generic sans. Those three static font instances are loaded explicitly in `src/app/opengraph-image.tsx` to stop that happening. Do not delete them.

## Deployment (Vercel)

```bash
npm i -g vercel   # if not already installed
vercel login
vercel link       # link this repo to a Vercel project
vercel --prod
```

In the Vercel dashboard:

1. Project Settings → Environment Variables → add `NEXT_PUBLIC_WEB3FORMS_KEY` and the per-mailbox keys (Production + Preview).
2. Project Settings → Domains → add `invisionsolutions.co.uk` and `www.invisionsolutions.co.uk`.
3. Copy the DNS records Vercel shows (A record for the apex, CNAME for `www`) into GoDaddy's DNS management for the domain. Copy them live from the dashboard rather than reusing IPs from documentation, since Vercel's anycast addresses have changed before.
4. Wait for propagation and confirm Vercel shows "Valid Configuration" for both domains.

The apex 308-redirects to `www`, so canonical URLs and Open Graph tags point at `www`. That is set by `SITE_URL` in `src/lib/metadata.ts`.

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

## Open items

- **Case study figures** are realistic but need checking against the real engagements before this page is treated as final.
- **Trademark clearance** has not been done. A UK IPO search in classes 9 and 42 is worth running before registering the mark.
