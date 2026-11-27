import { ArrowRight } from "lucide-react";
import {
  Section,
  PrimaryButton,
  TextLink,
  ExternalPrimaryButton,
  Rows,
  Row,
  WIDTH,
} from "@/components/ui";
import { SERVICES, CASE_STUDIES, CERTIFICATIONS, TOOLS } from "@/lib/content";
import { PAYRECKON_CALCULATORS, PAYRECKON_URL } from "@/lib/payreckon";
import { PUBLIC_CONTACT_ADDRESS } from "@/lib/mailboxes";

/*
 * Everything in the letterhead below is already stated elsewhere on this site:
 * the role and credentials on /approach, the company details in the footer.
 * Nothing is added here that is not published in full somewhere else.
 */
const LETTERHEAD: { term: string; lines: string[] }[] = [
  { term: "Principal consultant", lines: ["David Levi"] },
  { term: "Certified", lines: CERTIFICATIONS },
  {
    term: "Company",
    lines: ["Invision Solutions Ltd", "No. 16056944, England & Wales"],
  },
];

export default function Home() {
  return (
    <>
      <section>
        <div
          className={`${WIDTH} grid gap-14 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-20`}
        >
          <div>
            <h1 className="t-display max-w-[16ch]">
              Security consulting, done by the person you hired.
            </h1>
            <p className="t-lede mt-8 max-w-[38rem]">
              Invision Solutions is my consultancy. I work on cloud security
              architecture, DevSecOps, detection engineering and compliance,
              for engineering teams that want senior judgement without a layer
              of account managers in between.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <PrimaryButton href="/contact">
                Start a conversation
                <ArrowRight size={16} aria-hidden="true" />
              </PrimaryButton>
              <TextLink href="/services">See what I work on</TextLink>
            </div>
          </div>

          <dl className="self-end border-t border-line-strong">
            {LETTERHEAD.map((item) => (
              <div key={item.term} className="border-b border-line py-4">
                <dt className="t-label">{item.term}</dt>
                {item.lines.map((line) => (
                  <dd key={line} className="text-balance font-serif text-[1.0625rem] leading-snug text-ink">
                    {line}
                  </dd>
                ))}
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section label="Services">
        <h2 className="t-h2 max-w-[24ch]">What I work on</h2>
        <p className="t-body mt-6 max-w-[40rem]">
          Cloud architecture, DevSecOps, SIEM engineering and compliance from
          one person, so you are not coordinating four vendors.
        </p>
        <p className="t-small mt-4 max-w-[40rem]">
          Tools I work with: {TOOLS.join(", ")}.
        </p>
        <div className="mt-12">
          <Rows>
            {SERVICES.map((service) => (
              <Row key={service.slug} term={service.title}>
                {service.summary}
              </Row>
            ))}
          </Rows>
        </div>
        <div className="mt-10">
          <TextLink href="/services">Services and how we can work together</TextLink>
        </div>
      </Section>

      <Section label="How I work">
        <p className="max-w-[34ch] font-serif text-[clamp(1.5rem,1.05rem+1.6vw,2.2rem)] leading-[1.28] tracking-[-0.01em] text-ink">
          Most consultancies grow by adding people between you and the
          expertise you are paying for. I do not.
        </p>
        <p className="t-body mt-8 max-w-[40rem]">
          Every call, every architecture decision and every line of Terraform is
          mine, from the first conversation to the final handover. You never
          re-explain context to a new face, judgement is not diluted through a
          chain of approvals, and one person is accountable for the outcome.
        </p>
        <p className="t-body mt-5 max-w-[40rem]">
          Every recommendation starts from &ldquo;verify, don&rsquo;t
          assume&rdquo;: in architecture, in access, and in how the work itself
          is governed.
        </p>
        <div className="mt-10">
          <TextLink href="/approach">How an engagement runs</TextLink>
        </div>
      </Section>

      <Section label="Selected work">
        <h2 className="t-h2 max-w-[24ch]">Work I have done</h2>
        <p className="t-small mt-5 max-w-[36rem]">
          Anonymised to protect client confidentiality.
        </p>
        <div className="mt-12">
          <Rows>
            {CASE_STUDIES.slice(0, 3).map((study) => (
              <Row
                key={study.title}
                term={study.title}
                hint={`${study.discipline} · ${study.tag}`}
              >
                {study.situation}
              </Row>
            ))}
          </Rows>
        </div>
        <div className="mt-10">
          <TextLink href="/case-studies">All case studies</TextLink>
        </div>
      </Section>

      <Section label="My own product">
        <h2 className="t-h2">PayReckon</h2>
        <p className="t-body mt-6 max-w-[40rem]">
          A live product I designed, built and run. It compares UK take-home pay
          across umbrella, limited company and PAYE employment behind one shared
          tax engine, so the comparison is like for like rather than three
          separate tools disagreeing with each other.
        </p>
        <dl className="mt-10 max-w-[40rem] border-t border-line">
          {PAYRECKON_CALCULATORS.map((calc) => (
            <div
              key={calc.name}
              className="grid grid-cols-[9rem_minmax(0,1fr)] gap-4 border-b border-line py-3"
            >
              <dt className="font-serif text-[1.0625rem] text-ink">{calc.name}</dt>
              <dd className="t-small">{calc.route}</dd>
            </div>
          ))}
        </dl>
        <p className="t-label mt-4">
          Estimates for planning purposes, not financial advice.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <ExternalPrimaryButton href={PAYRECKON_URL}>Open PayReckon</ExternalPrimaryButton>
          <TextLink href="/payreckon">How it was built</TextLink>
        </div>
      </Section>

      <Section label="Contact">
        <p className="max-w-[26ch] font-serif text-[clamp(1.8rem,1.1rem+2.6vw,3rem)] leading-[1.1] tracking-[-0.018em] text-ink">
          Most engagements start with a conversation, not a proposal.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <PrimaryButton href="/contact">
            Start a conversation
            <ArrowRight size={16} aria-hidden="true" />
          </PrimaryButton>
          <a href={`mailto:${PUBLIC_CONTACT_ADDRESS}`} className="link font-sans text-[0.9375rem]">
            {PUBLIC_CONTACT_ADDRESS}
          </a>
        </div>
      </Section>
    </>
  );
}
