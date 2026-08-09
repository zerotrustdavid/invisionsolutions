import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { Reveal } from "@/components/reveal";
import { Web3Form, type Field } from "@/components/web3forms";
import { Section, Eyebrow } from "@/components/ui";
import { CONTACT_ACCESS_KEY, CONTACT_KEY_NAME } from "@/lib/mailboxes";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Start a conversation with David Levi, principal consultant at Invision Solutions. Every message reaches David directly.",
  path: "/contact",
});

const FIELDS: Field[] = [
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "company", label: "Company" },
  {
    name: "engagement_type",
    label: "Engagement type",
    type: "select",
    required: true,
    options: [
      "Fixed-scope assessment",
      "Project-based build",
      "Retained advisory",
      "Not sure yet",
    ],
  },
  { name: "message", label: "Message", type: "textarea", required: true, full: true },
];

export default function ContactPage() {
  return (
    <Section className="pt-20 sm:pt-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Start a conversation.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate">
            Every message here reaches David directly — there&apos;s no inbox
            triage or account team in the way.
          </p>
          <p className="mt-6 text-slate">
            I read and respond to every message personally.
          </p>
          <p className="mt-8 text-sm leading-relaxed text-slate">
            Have something more specific — pricing, invoicing, contracts, or
            support on live work?{" "}
            <Link
              href="/enquiries"
              className="text-blue-ink underline decoration-blue-ink/30 underline-offset-4 hover:decoration-blue-ink"
            >
              Send it to the right desk
            </Link>{" "}
            and it will reach the correct mailbox first time.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Web3Form
            accessKey={CONTACT_ACCESS_KEY}
            keyName={CONTACT_KEY_NAME}
            subject="New enquiry — Invision Solutions website"
            fields={FIELDS}
            successBody="Thanks — your message has been sent. David will get back to you directly."
          />
        </Reveal>
      </div>
    </Section>
  );
}
