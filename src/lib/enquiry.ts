/**
 * Enquiry handling that does not touch the network: what a submission may
 * contain, how it is checked, and what the email looks like.
 *
 * This file imports nothing on purpose. It is exercised directly by
 * `scripts/test-enquiry.mjs`, so the rules that decide what reaches the inbox
 * are tested without a server or a mail provider.
 */

/**
 * The three forms and the subject line each one sends. The subject is chosen
 * here from the form's kind and never from anything the visitor typed, so a
 * submission cannot set its own subject or inject a header. The wording is
 * unchanged from the previous setup because mail rules filter on it.
 */
export const FORM_SUBJECTS = {
  contact: "New enquiry — Invision Solutions website",
  enquiry: "General enquiry — Invision Solutions website",
  testimonial: "New testimonial — Invision Solutions website",
} as const;

export type FormKind = keyof typeof FORM_SUBJECTS;

const FORM_PATHS: Record<FormKind, string> = {
  contact: "/contact",
  enquiry: "/enquiries",
  testimonial: "/testimonials",
};

/**
 * Every field any form may send, in the order they appear in the email, with a
 * length limit each. A field that is not listed is ignored, so the endpoint
 * cannot be used to carry arbitrary extra data into the inbox.
 */
const FIELDS = [
  { name: "name", label: "Name", max: 200 },
  { name: "email", label: "Email", max: 254 },
  { name: "role", label: "Role or job title", max: 200 },
  { name: "company", label: "Company", max: 200 },
  { name: "engagement_type", label: "Engagement type", max: 200 },
  { name: "engagement", label: "What I helped with", max: 200 },
  { name: "permission", label: "May I publish this?", max: 200 },
  { name: "message", label: "Message", max: 5000, block: true },
  { name: "testimonial", label: "Testimonial", max: 5000, block: true },
] as const;

type FieldName = (typeof FIELDS)[number]["name"];

/** Fields a form must supply, by kind. */
const REQUIRED: Record<FormKind, FieldName[]> = {
  contact: ["name", "email", "engagement_type", "message"],
  enquiry: ["name", "email", "message"],
  testimonial: ["name", "email", "role", "company", "engagement", "testimonial", "permission"],
};

/** The request body is read as text first, so this bounds memory before parsing. */
export const MAX_BODY_BYTES = 20_000;

// One address, no whitespace, no angle brackets or commas. This is a sanity
// check that the value is safe to put in a Reply-To header, not a claim that the
// mailbox exists.
const EMAIL = /^[^\s@<>(),;:"\\]+@[^\s@<>(),;:"\\]+\.[^\s@<>(),;:"\\]{2,}$/;

export type Parsed =
  | { ok: true; spam: true }
  | {
      ok: true;
      spam: false;
      kind: FormKind;
      subject: string;
      replyTo: string;
      text: string;
    }
  | { ok: false; status: 400; error: "invalid"; fields: string[] };

const bad = (fields: string[] = []): Parsed => ({
  ok: false,
  status: 400,
  error: "invalid",
  fields,
});

/**
 * Check a decoded JSON body and build the email from it.
 *
 * A filled honeypot is reported as `spam`, not as an error: telling a bot which
 * check it tripped only helps it. Nothing is sent for it.
 */
export function parseEnquiry(body: unknown): Parsed {
  if (typeof body !== "object" || body === null || Array.isArray(body)) return bad();
  const input = body as Record<string, unknown>;

  const kind = input.kind;
  if (typeof kind !== "string" || !Object.hasOwn(FORM_SUBJECTS, kind)) return bad(["kind"]);
  const formKind = kind as FormKind;

  if (input.botcheck) return { ok: true, spam: true };

  const raw =
    typeof input.fields === "object" && input.fields !== null && !Array.isArray(input.fields)
      ? (input.fields as Record<string, unknown>)
      : null;
  if (!raw) return bad(["fields"]);

  const values = new Map<FieldName, string>();
  const problems: string[] = [];

  for (const field of FIELDS) {
    const value = raw[field.name];
    if (value === undefined || value === null || value === "") continue;
    if (typeof value !== "string") {
      problems.push(field.name);
      continue;
    }
    // Normalise line endings, then drop control characters other than newline
    // and tab. A single-line field with a newline in it is rejected below.
    const cleaned = value
      .replace(/\r\n?/g, "\n")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .trim();
    if (cleaned === "") continue;
    if (cleaned.length > field.max) {
      problems.push(field.name);
      continue;
    }
    if (!("block" in field) && cleaned.includes("\n")) {
      problems.push(field.name);
      continue;
    }
    values.set(field.name, cleaned);
  }

  for (const name of REQUIRED[formKind]) {
    if (!values.has(name)) problems.push(name);
  }

  const email = values.get("email");
  if (email !== undefined && !EMAIL.test(email)) problems.push("email");

  if (problems.length > 0) return bad([...new Set(problems)]);

  const lines: string[] = [];
  const blocks: string[] = [];
  for (const field of FIELDS) {
    const value = values.get(field.name);
    if (value === undefined) continue;
    if ("block" in field) blocks.push(`${field.label}:\n${value}`);
    else lines.push(`${field.label}: ${value}`);
  }

  const text = [
    `Sent from invisionsolutions.co.uk${FORM_PATHS[formKind]}`,
    "",
    lines.join("\n"),
    "",
    blocks.join("\n\n"),
    "",
  ].join("\n");

  return {
    ok: true,
    spam: false,
    kind: formKind,
    subject: FORM_SUBJECTS[formKind],
    replyTo: email as string,
    text,
  };
}

/**
 * A fixed-window limiter, kept in memory.
 *
 * Stated plainly: on a serverless host each warm instance has its own memory, so
 * this slows a single noisy client and protects the mail quota against a simple
 * loop, but it is not a global limit and a determined attacker spreading
 * requests across instances would get past it. It is a backstop, not the
 * control that makes the form safe from abuse.
 */
export function createRateLimiter(limit: number, windowMs: number, now: () => number = Date.now) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return function allow(key: string): boolean {
    const t = now();
    // Keep the map bounded: drop expired entries once it grows.
    if (hits.size > 500) {
      for (const [k, v] of hits) if (v.resetAt <= t) hits.delete(k);
    }
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= t) {
      hits.set(key, { count: 1, resetAt: t + windowMs });
      return true;
    }
    if (entry.count >= limit) return false;
    entry.count += 1;
    return true;
  };
}
