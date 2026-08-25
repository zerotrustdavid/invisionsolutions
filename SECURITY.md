# Security

This repository holds the marketing site for Invision Solutions Ltd. It is a
static-rendered Next.js application with no backend, no database, and no user
accounts. Contact forms post directly from the browser to Web3Forms.

## Reporting a vulnerability

Email **david@invisionsolutions.co.uk**.

Please include enough detail to reproduce the issue: the affected URL or file, the
steps, and what you observed. If you have a proof of concept, send it rather than
describing it.

I read these myself. I will confirm receipt, tell you what I make of it, and let
you know when it is resolved. I am not going to publish a response-time
commitment I cannot reliably meet as a sole operator, so treat the absence of one
as honesty rather than indifference.

Please do not open a public issue for a security report, and please give me a
chance to fix it before disclosing.

### Out of scope

Denial of service, volumetric testing, social engineering, physical attacks, and
automated scanner output submitted without a demonstrated impact.

Do not submit real enquiries through the contact forms as test traffic. They go
to a working business inbox.

## The Web3Forms access keys are publishable, and that is not a finding

The `NEXT_PUBLIC_WEB3FORMS_KEY*` values are visible in the client bundle. This is
by design, it is documented by the provider, and it is not a vulnerability
report I need.

The specifics, so a reviewer can judge for themselves rather than take my word:

- The keys carry the `NEXT_PUBLIC_` prefix, which means Next inlines them into
  the JavaScript bundle at build time. Anyone can read them from the deployed
  site. Their presence in a build is not a leak; it is the mechanism working.
- A key identifies a form. A form's recipients are configured in the provider's
  dashboard and cannot be overridden by the client, which is what stops the
  endpoint being an open relay.
- The realistic risk is therefore **spam and quota consumption**, not disclosure
  of anything confidential.
- There is **no way to rotate a key**. The access key *is* the form identifier.
  Deleting the form is the only way to invalidate one. Any report recommending
  rotation is describing a control this provider does not offer.

### On the domain restriction

The provider offers a "Restrict to Domains" setting, and it is enabled.

It is worth being accurate about what it does: it is enforced against a request
header that any client can set. It raises the effort required to reuse a key
elsewhere. **It does not prevent abuse, and it is not the control that settles
the question.** It is not presented here as one.

## What the automated scanning does and does not catch

CI runs gitleaks across full history on every pull request, configured by
`.gitleaks.toml`.

The important part is a deliberate backstop rule matching **any bare UUID
literal** in source, not merely a UUID assigned to something called "key" or
"secret". That rule exists because the obvious identifier-based rule misses the
realistic case: a real key pasted into a test fixture and assigned to a constant
with an innocuous name.

Stated plainly, because it would be easy to imply otherwise: **GitHub's secret
scanning and push protection would not have caught this credential class
either.** A bare UUID has too little entropy and no distinguishing prefix for a
generic detector to flag without unusable false-positive rates. Those features
are enabled on their own merits. Neither is the control that covers Web3Forms
keys. The backstop rule is.

## Dependency and supply-chain handling

- CI installs with `npm ci --ignore-scripts`. Dependency install scripts execute
  arbitrary code before any project code runs, which is the mechanism behind most
  npm supply-chain compromises.
- `npm run check:install-scripts` enumerates every dependency install script and
  fails the build on any that is not on a reviewed allowlist, where each entry
  records what the script does and how that was verified.
- The CI workflow requests `contents: read`, references no secrets, and uses
  `pull_request` rather than `pull_request_target`, so a fork's branch is never
  built with credentials in scope.
- gitleaks is fetched by pinned version and verified against a pinned SHA256
  rather than being run through a third-party action.

## Security headers

Set in `next.config.ts` and applied to every route: Content-Security-Policy,
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
`frame-ancestors`, and HSTS. `X-Powered-By` is disabled.

HSTS is sent with `max-age` and `includeSubDomains` and deliberately **without
`preload`**. Preload submission is effectively irreversible, and the header
should not advertise an intent that has not been decided.

The CSP `connect-src` must continue to allow `https://api.web3forms.com`. Every
form on the site posts there from the browser, so tightening that directive
breaks lead capture on three pages at once, and a build will not catch it.
