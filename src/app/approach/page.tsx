import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import {
  Section,
  PageHead,
  PrimaryButton,
  ExternalTextLink,
  Rows,
  Row,
} from "@/components/ui";
import { PERSONAL_LINKEDIN_URL } from "@/components/social-icons";

export const metadata: Metadata = pageMetadata({
  title: "Approach",
  description:
    "I am David Levi, founder and principal consultant at Invision Solutions. I am AWS and Azure certified and work directly across cloud security, DevSecOps and compliance.",
  path: "/approach",
});

const PROCESS = [
  {
    title: "Discover",
    body: "A direct conversation about the actual problem, not a scripted discovery call. Scope and constraints get defined together.",
  },
  {
    title: "Assess",
    body: "Hands-on review of the current environment: architecture, access model, pipeline, or compliance posture, depending on the engagement.",
  },
  {
    title: "Build or Remediate",
    body: "The implementation work itself (infrastructure changes, detection rules, pipeline gates, documentation), delivered directly, with visibility into progress throughout.",
  },
  {
    title: "Sustain",
    body: "Handover, documentation and, where the engagement calls for it, an ongoing advisory relationship rather than a one-off drop-off.",
  },
];

export default function ApproachPage() {
  return (
    <>
      <PageHead
        title="Invision Solutions is one person, by design."
        lede="Most consultancies grow by adding people between you and the expertise you are paying for. I do not. You deal with the person doing the work, from the first call to the final handover."
      />

      <Section label="About">
        <h2 className="t-h2">David Levi</h2>
        <p className="t-label mt-2">Founder and principal consultant</p>
        <p className="t-body mt-8 max-w-[40rem]">
          I founded Invision Solutions and work as its principal consultant. I
          hold a BSc in Cybersecurity from the University of Bolton, I am an AWS
          Certified Solutions Architect – Professional, and I hold
          Microsoft&rsquo;s AZ-900 Azure Fundamentals certification. My work
          covers cloud security architecture across AWS, Azure and GCP; DevSecOps
          and CI/CD security engineering; SIEM and detection engineering; and
          compliance programmes aligned to ISO 27001 and SOC 2.
        </p>
        <div className="mt-8">
          <ExternalTextLink href={PERSONAL_LINKEDIN_URL}>
            Connect on LinkedIn
          </ExternalTextLink>
        </div>
      </Section>

      <Section label="Process">
        <h2 className="t-h2 max-w-[24ch]">How an engagement runs</h2>
        <div className="mt-12">
          <Rows>
            {PROCESS.map((step, i) => (
              <Row key={step.title} term={step.title} hint={`Step ${i + 1}`}>
                {step.body}
              </Row>
            ))}
          </Rows>
        </div>
      </Section>

      <Section label="Next step">
        <p className="max-w-[26ch] font-serif text-[clamp(1.8rem,1.1rem+2.6vw,3rem)] leading-[1.1] tracking-[-0.018em] text-ink">
          Most engagements start with a conversation, not a proposal.
        </p>
        <div className="mt-10">
          <PrimaryButton href="/contact">
            Get in touch
            <ArrowRight size={16} aria-hidden="true" />
          </PrimaryButton>
        </div>
      </Section>
    </>
  );
}
