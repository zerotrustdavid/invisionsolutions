import type { NextConfig } from "next";

/**
 * Content-Security-Policy.
 *
 * The single directive that carries operational risk here is `connect-src`.
 * Every form on the site (on /contact, /enquiries and /testimonials) posts to
 * api.web3forms.com with `fetch` from the browser. Removing that origin does not
 * fail a build, does not fail a lint, and does not fail a type check. It fails
 * lead capture on three pages at once, silently, in production. Treat it as
 * load-bearing.
 *
 * On `'unsafe-inline'` in `script-src`, stated plainly rather than dressed up:
 * Next's App Router emits inline bootstrap and streaming scripts. Removing
 * `'unsafe-inline'` means issuing a per-request nonce from middleware, which
 * forces every page out of static rendering. For a statically generated
 * marketing site that reflects no user input anywhere (there is no
 * `dangerouslySetInnerHTML` in this codebase, and every form value goes straight
 * to `fetch` rather than back into the DOM) that trade is not obviously worth
 * making. So the header is a real baseline, not a strict CSP, and it is not
 * described as one.
 *
 * `'unsafe-eval'` is allowed in development only, where React's refresh runtime
 * needs it. It is absent from production builds.
 */
const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Tailwind and next/font both inject inline style attributes.
  "style-src 'self' 'unsafe-inline'",
  // next/font self-hosts, so no external font origin is needed.
  "font-src 'self'",
  // data: covers the build-time generated icon and Open Graph card.
  "img-src 'self' data: blob:",
  // Load-bearing. See the note above.
  "connect-src 'self' https://api.web3forms.com",
  // The forms submit via fetch; this covers the no-JS native fallback.
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // frame-ancestors above is the modern control; this covers older agents.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  {
    // Deliberately no `preload`. Submission to the preload list is effectively
    // irreversible, and the header should not advertise an intent that has not
    // been decided. Adding it later is a one-word change; withdrawing it is not.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  // Removes the X-Powered-By: Next.js response header.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
