import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Reveal } from "@/components/reveal";
import { Web3Form, type Field } from "@/components/web3forms";
import { Section, Eyebrow } from "@/components/ui";
import {
  CONTACT_ACCESS_KEY,
  CONTACT_KEY_NAME,
  PUBLIC_CONTACT_ADDRESS,
} from "@/lib/mailboxes";

export const metadata: Metadata = pageMetadata({
  title: "Enquiries",
  description:
    "Send a general enquiry to Invision Solutions. Every message reaches David Levi directly.",
  path: "/enquiries",
});

const FIELDS: Field[] = [
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "company", label: "Company" },
  { name: "message", label: "Message", type: "textarea", required: true, full: true },
];

export default function EnquiriesPage() {
  return (
    <Section className="pt-20 sm:pt-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        <Reveal>
          <Eyebrow>Enquiries</Eyebrow>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Send an enquiry.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate">
            Sales, pricing, invoicing, contracts, support on live work, or an
            introduction — it all comes to the same place, and it comes to David
            directly.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-slate">
            Prefer email? Send it to{" "}
            <a
              href={`mailto:${PUBLIC_CONTACT_ADDRESS}`}
              className="text-blue-ink underline decoration-blue-ink/30 underline-offset-4 hover:decoration-blue-ink"
            >
              {PUBLIC_CONTACT_ADDRESS}
            </a>
            .
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Web3Form
            accessKey={CONTACT_ACCESS_KEY}
            keyName={CONTACT_KEY_NAME}
            subject="General enquiry — Invision Solutions website"
            fields={FIELDS}
            submitLabel="Send"
            successBody={`Thanks — your message is on its way to ${PUBLIC_CONTACT_ADDRESS}.`}
          />
        </Reveal>
      </div>
    </Section>
  );
}
