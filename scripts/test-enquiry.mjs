// Tests for the rules that decide what reaches the inbox. Plain node:test, no
// dependencies. Node 22 strips the types when importing the .ts file directly.
//
// Run: npm run test:enquiry
import test from "node:test";
import assert from "node:assert/strict";
import { parseEnquiry, createRateLimiter, FORM_SUBJECTS } from "../src/lib/enquiry.ts";

const contact = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  engagement_type: "Project-based build",
  message: "Hello.\nSecond line.",
};
const ok = (kind, fields, extra = {}) => parseEnquiry({ kind, fields, ...extra });

test("a complete contact form is accepted and builds the email", () => {
  const r = ok("contact", contact);
  assert.equal(r.ok, true);
  assert.equal(r.spam, false);
  assert.equal(r.subject, FORM_SUBJECTS.contact);
  assert.equal(r.replyTo, "ada@example.com");
  for (const line of ["Name: Ada Lovelace", "Company: Analytical Engines", "Engagement type: Project-based build", "Message:\nHello.\nSecond line."])
    assert.ok(r.text.includes(line), `email text should contain: ${line}`);
  assert.ok(r.text.includes("/contact"));
});

test("subjects are the three existing lines, unchanged", () => {
  assert.equal(FORM_SUBJECTS.contact, "New enquiry — Invision Solutions website");
  assert.equal(FORM_SUBJECTS.enquiry, "General enquiry — Invision Solutions website");
  assert.equal(FORM_SUBJECTS.testimonial, "New testimonial — Invision Solutions website");
});

test("the enquiry form does not need engagement type or company", () => {
  const rest = { name: contact.name, email: contact.email, message: contact.message };
  assert.equal(ok("enquiry", rest).ok, true);
});

test("the contact form does need engagement type", () => {
  const rest = { ...contact, engagement_type: undefined };
  const r = ok("contact", rest);
  assert.equal(r.ok, false);
  assert.deepEqual(r.fields, ["engagement_type"]);
});

test("the testimonial form needs its own fields and carries them through", () => {
  const f = {
    name: "A", email: "a@example.com", role: "CTO", company: "X",
    engagement: "Other", testimonial: "It went well.", permission: "No, this is private feedback",
  };
  const r = ok("testimonial", f);
  assert.equal(r.ok, true);
  assert.ok(r.text.includes("May I publish this?: No, this is private feedback"));
  assert.ok(r.text.includes("Testimonial:\nIt went well."));
  assert.equal(ok("testimonial", { ...f, permission: "" }).ok, false);
});

test("an unknown or inherited kind is refused", () => {
  for (const kind of ["sales", "", "__proto__", "constructor", undefined, 5])
    assert.equal(parseEnquiry({ kind, fields: contact }).ok, false, String(kind));
});

test("bodies that are not objects are refused", () => {
  for (const body of [null, undefined, "x", 5, [], [contact]])
    assert.equal(parseEnquiry(body).ok, false);
  assert.equal(parseEnquiry({ kind: "contact" }).ok, false);
  assert.equal(parseEnquiry({ kind: "contact", fields: [] }).ok, false);
});

test("a filled honeypot is silently spam, whatever else is in the body", () => {
  const r = parseEnquiry({ kind: "contact", fields: {}, botcheck: "1" });
  assert.deepEqual(r, { ok: true, spam: true });
});

test("a bad email is refused, including header-injection attempts", () => {
  for (const email of ["", "nope", "a@b", "a b@example.com", "a@example.com\nBcc: x@y.com", "<a@example.com>", "a@example.com, b@example.com", "\"a\"@example.com"])
    assert.equal(ok("enquiry", { ...contact, email }).ok, false, JSON.stringify(email));
});

test("a newline in a one-line field is refused, in a block field it is kept", () => {
  assert.equal(ok("enquiry", { ...contact, name: "Ada\nBcc: x@y.com" }).ok, false);
  assert.equal(ok("enquiry", { ...contact, message: "a\n\nb" }).ok, true);
});

test("length limits apply", () => {
  assert.equal(ok("enquiry", { ...contact, message: "x".repeat(5000) }).ok, true);
  const r = ok("enquiry", { ...contact, message: "x".repeat(5001) });
  assert.equal(r.ok, false);
  assert.deepEqual(r.fields, ["message"]);
  assert.equal(ok("enquiry", { ...contact, name: "x".repeat(201) }).ok, false);
});

test("non-string values are refused", () => {
  assert.equal(ok("enquiry", { ...contact, name: ["Ada"] }).ok, false);
  assert.equal(ok("enquiry", { ...contact, message: { a: 1 } }).ok, false);
  assert.equal(ok("enquiry", { ...contact, name: 5 }).ok, false);
});

test("unlisted fields are ignored and never reach the email", () => {
  const r = ok("enquiry", { ...contact, subject: "Free money", bcc: "x@y.com", to: "x@y.com" });
  assert.equal(r.ok, true);
  assert.equal(r.subject, FORM_SUBJECTS.enquiry);
  assert.ok(!/Free money|x@y\.com/.test(r.text));
});

test("control characters are stripped and whitespace-only fields count as missing", () => {
  const r = ok("enquiry", { ...contact, message: "hello\u0000\u0007 there" });
  assert.ok(r.text.includes("hello there"));
  assert.equal(ok("enquiry", { ...contact, message: "   \n  " }).ok, false);
});

test("the rate limiter allows the limit, then refuses, then recovers", () => {
  let t = 0;
  const allow = createRateLimiter(3, 1000, () => t);
  assert.deepEqual([allow("a"), allow("a"), allow("a"), allow("a")], [true, true, true, false]);
  assert.equal(allow("b"), true, "another visitor is unaffected");
  t = 1001;
  assert.equal(allow("a"), true, "the window has passed");
});
