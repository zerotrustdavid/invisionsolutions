import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Section, PageHead } from "@/components/ui";
import { EnquiryForm, type Field } from "@/components/enquiry-form";
import { PUBLIC_CONTACT_ADDRESS } from "@/lib/mailboxes";

export const metadata: Metadata = pageMetadata({
  title: "Testimonials",
  description:
    "Leave a testimonial about working with Invision Solutions, or read what clients have said about the engagement.",
  path: "/testimonials",
});

/**
 * Published testimonials.
 *
 * Deliberately empty. Nothing goes in here that a real client has not written
 * and approved for publication. An invented testimonial on a page whose entire
 * purpose is proving authenticity would defeat the point of the page.
 */
const TESTIMONIALS: {
  quote: string;
  name: string;
  role: string;
  company: string;
}[] = [];

const FIELDS: Field[] = [
  { name: "name", label: "Your name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "role", label: "Role or job title", required: true },
  { name: "company", label: "Company", required: true },
  {
    name: "engagement",
    label: "What did I help you with?",
    type: "select",
    required: true,
    options: [
      "Cloud security & architecture",
      "DevSecOps & CI/CD security",
      "Security operations & SIEM",
      "Compliance & governance (ISO 27001 / SOC 2)",
      "Fractional security leadership",
      "Other",
    ],
  },
  {
    name: "testimonial",
    label: "Your testimonial",
    type: "textarea",
    required: true,
    rows: 7,
    full: true,
    placeholder:
      "What was the problem, how was it handled, and what changed as a result? Specifics are far more persuasive than praise.",
  },
  {
    name: "permission",
    label: "May I publish this?",
    type: "select",
    required: true,
    full: true,
    options: [
      "Yes, publish with my name, role and company",
      "Yes, publish with my role and company only",
      "Yes, publish anonymously",
      "No, this is private feedback",
    ],
  },
];

export default function TestimonialsPage() {
  return (
    <>
      {/*
        Reads as an invitation until there is something to show, and switches to
        the provenance statement once quotes are published, which only makes
        sense to claim when quotes actually exist.
      */}
      <PageHead
        title="What it is actually like to work with Invision Solutions."
        lede={
          TESTIMONIALS.length > 0
            ? "Every testimonial here is written by a real client and published with their permission. Nothing on this page is paraphrased, composited, or written on anyone’s behalf."
            : "A client’s words carry more weight than anything I could write about my own work. If I’ve delivered for you, the form below takes a few minutes, and you decide how it appears, or whether it appears at all."
        }
      />

      {/*
        Skipped entirely while TESTIMONIALS is empty: no placeholder, no "none
        yet" notice. Adding entries to the array brings this section back.
      */}
      {TESTIMONIALS.length > 0 && (
        <Section label="Testimonials">
          <div className="space-y-16">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name}>
                <blockquote className="max-w-[34ch] font-serif text-[clamp(1.4rem,1.05rem+1.3vw,2rem)] leading-[1.35] tracking-[-0.01em] text-ink">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="t-small mt-6">
                  <span className="font-medium text-ink">{t.name}</span>, {t.role},{" "}
                  {t.company}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      <Section label="Leave a testimonial">
        <h2 className="t-h2 max-w-[24ch]">Worked together? I&rsquo;d value your words.</h2>
        <p className="t-body mt-6 max-w-[40rem]">
          Detail helps more than praise. What the problem was, how it was
          handled, and what actually changed tells a prospective client far more
          than an adjective does.
        </p>
        <p className="t-small mt-5 max-w-[40rem]">
          You control how it appears, including anonymously, or as private
          feedback that is never published. Nothing goes live without the
          permission you select. Prefer email? Send it to{" "}
          <a href={`mailto:${PUBLIC_CONTACT_ADDRESS}`} className="link">
            {PUBLIC_CONTACT_ADDRESS}
          </a>
          .
        </p>

        <div className="mt-12 max-w-[40rem]">
          <EnquiryForm
            kind="testimonial"
            fields={FIELDS}
            submitLabel="Submit testimonial"
            successTitle="Testimonial received"
            successBody="Thank you, that means a lot. I will read it personally and check with you before anything is published."
          />
        </div>
      </Section>
    </>
  );
}
