import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { Section, PageHead, PrimaryButton, Rows, Row } from "@/components/ui";
import { SERVICES } from "@/lib/content";
import { PUBLIC_CONTACT_ADDRESS } from "@/lib/mailboxes";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Cloud security architecture, DevSecOps, SIEM engineering, compliance and fractional security leadership, delivered directly by me as a one-off assessment, a project build or ongoing advisory.",
  path: "/services",
});

const ENGAGEMENT_MODELS = [
  {
    title: "Fixed-scope assessment",
    body: "A bounded piece of work (e.g. a cloud security review or SOC 2 readiness gap analysis) with a clear deliverable and timeline.",
  },
  {
    title: "Project-based build",
    body: "Hands-on implementation work (e.g. a CI/CD security overhaul or SIEM migration) scoped to a defined outcome.",
  },
  {
    title: "Retained advisory",
    body: "Ongoing access on a day-rate or monthly-retainer basis for organisations that want continuity rather than a one-off engagement.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHead
        title="What I work on, and how we can work together."
        lede="I scope every engagement directly, so you speak to the person who will do the work."
      />

      <Section label="Services">
        <Rows>
          {SERVICES.map((service) => (
            <Row key={service.slug} term={service.title} as="h2">
              {service.summary}
            </Row>
          ))}
        </Rows>
      </Section>

      <Section label="Engagement">
        <h2 className="t-h2 max-w-[24ch]">How the work is structured</h2>
        <div className="mt-12">
          <Rows>
            {ENGAGEMENT_MODELS.map((model) => (
              <Row key={model.title} term={model.title}>
                {model.body}
              </Row>
            ))}
          </Rows>
        </div>
        <p className="t-small mt-10">
          Pricing question? Day rates and retainer costs go to{" "}
          <a href={`mailto:${PUBLIC_CONTACT_ADDRESS}`} className="link">
            {PUBLIC_CONTACT_ADDRESS}
          </a>
          .
        </p>
      </Section>

      <Section label="Next step">
        <p className="max-w-[24ch] font-serif text-[clamp(1.8rem,1.1rem+2.6vw,3rem)] leading-[1.1] tracking-[-0.018em] text-ink">
          Not sure which model fits? Let&rsquo;s talk it through.
        </p>
        <div className="mt-10">
          <PrimaryButton href="/contact">
            Start a conversation
            <ArrowRight size={16} aria-hidden="true" />
          </PrimaryButton>
        </div>
      </Section>
    </>
  );
}
