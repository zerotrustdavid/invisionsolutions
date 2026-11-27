import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Section, PageHead, EmailLink } from "@/components/ui";
import { EnquiryForm, type Field } from "@/components/enquiry-form";

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
          <EmailLink />
        </p>
      </PageHead>

      <Section label="Send a message">
        <div className="max-w-[40rem]">
          <EnquiryForm
            kind="contact"
            fields={FIELDS}
            successBody="Thanks. Your message has been sent, and I will get back to you directly."
          />
        </div>
      </Section>
    </>
  );
}
