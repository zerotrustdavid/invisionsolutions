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
  title: "Enquiries",
  description:
    "Send a general enquiry to Invision Solutions. Every message reaches me, David Levi, directly.",
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
    <>
      <PageHead
        title="Send an enquiry."
        lede="Sales, pricing, invoicing, contracts, support on live work or an introduction: it all comes to the same place, and it comes to me directly."
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
            subject="General enquiry — Invision Solutions website"
            fields={FIELDS}
            submitLabel="Send"
            successBody="Thanks. Your message is on its way to me."
          />
        </div>
      </Section>
    </>
  );
}
