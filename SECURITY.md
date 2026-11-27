# Security

This repository holds the marketing site for Invision Solutions Ltd. It is a
static-rendered Next.js application with no database and no user accounts. The
one piece of server code is `/api/enquiry`, which the contact forms post to and
which sends each submission by email.

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

## How the forms work

The three forms (`/contact`, `/enquiries`, `/testimonials`) post JSON to
`/api/enquiry` on the site's own origin. That route, in
`src/app/api/enquiry/route.ts`, checks the request and emails it through Resend.
Nothing about delivery is configured in the browser: the Resend key is a
server-only environment variable with no `NEXT_PUBLIC_` prefix, so it is never
compiled into the client bundle.

What the route does. The input rules are tested in `scripts/test-enquiry.mjs`; I
exercised the rest against a build, with a stub in place of the mail provider,
before release:

- Accepts only the three known form kinds, and only listed fields, each with a
  length limit. The subject line comes from the kind, never from the submission,
  and the visitor's email goes only into `Reply-To`, after a check that it is a
  single address with no line breaks.
- Refuses a cross-site browser request (an `Origin` that is not this site).
- Treats a filled honeypot field as spam: it answers as if it worked and sends
  nothing.
- Applies a rate limit that is held in memory per server instance. That slows one
  noisy client and protects the mail quota against a simple loop; it is **not** a
  global limit, and it is not presented as the control that makes the form safe
  from abuse.
- Reports success only after Resend has accepted the message and returned an id.
  Missing configuration or a refused send is an error the visitor sees.
- Does not write the content of a submission to the logs.

The realistic risk for a contact form is spam and quota use rather than
disclosure of anything confidential. I would like to hear about a way around the
checks above.

## What the automated scanning does and does not catch

CI runs gitleaks across full history on every pull request, configured by
`.gitleaks.toml`.

It includes a deliberate backstop rule matching **any bare UUID literal** in
source. It dates from when the site used a form key that was a bare UUID, which a
generic detector cannot flag without unusable false-positive rates, and it is
kept because a real key pasted into a test fixture under an innocuous name is
the realistic way such a credential is leaked. It is not a statement about the
credential the site holds today.

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

The CSP `connect-src` is `'self'`, because the forms post to this site's own route. Adding an origin there widens where injected script could send data.
