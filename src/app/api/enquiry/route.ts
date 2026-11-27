import { createRateLimiter, MAX_BODY_BYTES, parseEnquiry } from "@/lib/enquiry";
import { PUBLIC_CONTACT_ADDRESS } from "@/lib/mailboxes";

/**
 * Where every form on the site posts: /contact, /enquiries and /testimonials.
 *
 * The browser sends the submission here, on this site's own origin, and this
 * route emails it through Resend. There is no public key in the page and no
 * third-party origin for the browser to reach.
 *
 * Three rules, because the lead path has failed silently before:
 *
 *  1. Success is reported only after Resend has accepted the message and
 *     returned an id. Anything else is an error the visitor sees.
 *  2. Missing configuration is an error, logged and shown, never a pretend
 *     success. The environment is read once, here.
 *  3. The submission's content is never written to the logs. Only the
 *     outcome is.
 *
 * Configuration, all server-only (none has a NEXT_PUBLIC_ prefix):
 *   RESEND_API_KEY   required. A sending-only key.
 *   ENQUIRY_FROM     optional. Must be on a domain verified in Resend.
 *   ENQUIRY_TO       optional. Defaults to the address the site publishes.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "Invision Solutions website <website@invisionsolutions.co.uk>";

// Per warm instance, so a backstop and not a global limit. See createRateLimiter.
const perVisitor = createRateLimiter(5, 10 * 60_000);
const overall = createRateLimiter(40, 60 * 60_000);

const headers = { "Cache-Control": "no-store" };

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers });
}

export async function POST(request: Request) {
  // A browser always sends Origin on a cross-site POST. Refuse one that is not
  // this site, so another page cannot post here from a visitor's browser. A
  // request with no Origin (a command-line client) is not a browser attack.
  const origin = request.headers.get("origin");
  if (origin) {
    let sameSite = false;
    try {
      sameSite = new URL(origin).host === request.headers.get("host");
    } catch {
      sameSite = false;
    }
    if (!sameSite) return reply(403, { error: "forbidden" });
  }

  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return reply(415, { error: "invalid" });
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return reply(413, { error: "invalid" });

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return reply(400, { error: "invalid" });
  }

  const parsed = parseEnquiry(body);
  if (!parsed.ok) return reply(parsed.status, { error: parsed.error, fields: parsed.fields });

  // A filled honeypot: answer as if it worked, send nothing.
  if (parsed.spam) return reply(200, { ok: true });

  const visitor =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (!perVisitor(visitor) || !overall("all")) {
    console.warn("[enquiry] Rate limit reached.");
    return reply(429, { error: "rate_limited" });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error(
      "[enquiry] RESEND_API_KEY is not set, so this enquiry was NOT sent. " +
        "Set it in the hosting environment as a server-only variable and redeploy.",
    );
    return reply(503, { error: "not_configured" });
  }

  let response: Response;
  try {
    response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM?.trim() || DEFAULT_FROM,
        to: [process.env.ENQUIRY_TO?.trim() || PUBLIC_CONTACT_ADDRESS],
        reply_to: parsed.replyTo,
        subject: parsed.subject,
        text: parsed.text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error(
      "[enquiry] Could not reach Resend, so this enquiry was NOT sent:",
      error instanceof Error ? error.name : "unknown error",
    );
    return reply(502, { error: "delivery_failed" });
  }

  let result: { id?: unknown; message?: unknown; name?: unknown } = {};
  try {
    result = await response.json();
  } catch {
    // Handled below: no id means no success.
  }

  if (!response.ok || typeof result.id !== "string" || result.id === "") {
    // Resend's own message names the cause (unverified domain, bad key, quota)
    // and carries nothing from the visitor's submission.
    console.error(
      `[enquiry] Resend refused it (HTTP ${response.status}), so this enquiry was NOT sent:`,
      typeof result.message === "string" ? result.message : "no message",
    );
    return reply(502, { error: "delivery_failed" });
  }

  console.info(`[enquiry] Sent ${parsed.kind} enquiry as ${result.id}.`);
  return reply(200, { ok: true });
}

export function GET() {
  return reply(405, { error: "method_not_allowed" });
}
