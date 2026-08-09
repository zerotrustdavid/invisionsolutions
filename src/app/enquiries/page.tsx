import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Reveal } from "@/components/reveal";
import { Web3Form, type Field } from "@/components/web3forms";
import { Section, Eyebrow, SurfaceCard } from "@/components/ui";
import { MAILBOXES } from "@/lib/mailboxes";

export const metadata: Metadata = pageMetadata({
  title: "Enquiries",
  description:
    "Send your enquiry straight to the right desk at Invision Solutions — sales, support, billing, invoices, contracts, or partnerships.",
  path: "/enquiries",
});

const FIELDS: Field[] = [
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "company", label: "Company" },
  { name: "message", label: "Message", type: "textarea", required: true, rows: 4 },
];

export default function EnquiriesPage() {
  return (
    <>
      <Section className="pt-20 sm:pt-24">
        <Reveal>
          <Eyebrow>Enquiries</Eyebrow>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Send it to the right desk.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate">
            Each form below goes to its own mailbox, so your enquiry lands where
            it belongs instead of queuing behind everything else. It still
            reaches David — this only decides which inbox it arrives in.
          </p>
        </Reveal>
      </Section>

      <Section className="!pt-0">
        <div className="grid gap-6 lg:grid-cols-2">
          {MAILBOXES.map((box, i) => (
            <Reveal key={box.slug} delay={i * 0.05}>
              <SurfaceCard className="flex h-full flex-col" id={box.slug}>
                <h2 className="font-display text-xl font-medium tracking-tight text-ink">
                  {box.label}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  {box.description}
                </p>
                <p className="mt-3 font-mono text-[11px] tracking-wider text-gold-ink">
                  {box.address}
                </p>

                <div className="mt-5">
                  <Web3Form
                    compact
                    accessKey={box.accessKey}
                    keyName={box.keyName}
                    subject={`${box.label} — Invision Solutions website`}
                    fields={FIELDS}
                    submitLabel="Send"
                    successBody={`Thanks — your message is on its way to ${box.address}.`}
                  />
                </div>
              </SurfaceCard>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
