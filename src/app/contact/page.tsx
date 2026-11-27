import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Section, PageHead } from "@/components/ui";
import { Web3Form, type Field } from "@/components/web3forms";
import {
  CONTACT_ACCESS_KEY,
  CONTACT_KEY_NAME,
  PUBLIC_CONTACT_ADDRESS,
} from "@/lib/mailboxes";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Start a conversation with me, David Levi, principal consultant at Invision Solutions. Every message reaches me directly.",
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
    <>
      <PageHead
        title="Start a conversation."
        lede="Every message reaches me directly. There is no triage and no account team in the way. I read and respond to every message personally."
      >
        <p className="t-small mt-8">
          Prefer email? Send it to{" "}
          <a href={`mailto:${PUBLIC_CONTACT_ADDRESS}`} className="link">
            {PUBLIC_CONTACT_ADDRESS}
          </a>
          .
        </p>
      </PageHead>

      <Section label="Send a message">
        <div className="max-w-[40rem]">
          <Web3Form
            accessKey={CONTACT_ACCESS_KEY}
            keyName={CONTACT_KEY_NAME}
            subject="New enquiry — Invision Solutions website"
            fields={FIELDS}
            successBody="Thanks. Your message has been sent, and I will get back to you directly."
          />
        </div>
      </Section>
    </>
  );
}
