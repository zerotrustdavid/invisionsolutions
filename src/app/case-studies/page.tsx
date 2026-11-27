import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/metadata";
import {
  Section,
  PageHead,
  PrimaryButton,
  ExternalTextLink,
  TextLink,
} from "@/components/ui";
import { CASE_STUDIES } from "@/lib/content";
import { PAYRECKON_URL } from "@/lib/payreckon";

export const metadata: Metadata = pageMetadata({
  title: "Case studies",
  description:
    "Anonymised case studies across DevSecOps, cloud migration, CSPM, SOC 2 Type II readiness, security architecture and solution architecture, plus PayReckon, a live product I built myself.",
  path: "/case-studies",
});

/**
 * Situation, action and outcome as labelled rows. The outcome is set a step
 * heavier than the rest because it is the part a reader came for.
 */
function Account({
  situation,
  action,
  outcome,
}: {
  situation: ReactNode;
  action: ReactNode;
  outcome: ReactNode;
}) {
  const row = "grid gap-x-8 gap-y-1 sm:grid-cols-[7rem_minmax(0,1fr)]";
  return (
    <dl className="mt-9 space-y-7">
      <div className={row}>
        <dt className="t-label pt-1.5">Situation</dt>
        <dd className="t-small !text-[1.0625rem] !leading-[1.7]">{situation}</dd>
      </div>
      <div className={row}>
        <dt className="t-label pt-1.5">Action</dt>
        <dd className="t-small !text-[1.0625rem] !leading-[1.7]">{action}</dd>
      </div>
      <div className={row}>
        <dt className="t-label pt-1.5">Outcome</dt>
        <dd className="font-serif text-[1.1875rem] leading-[1.65] text-ink">
          {outcome}
        </dd>
      </div>
    </dl>
  );
}

export default function CaseStudiesPage() {
  return (
    <>
      <PageHead
        title="A sample of the work I take on."
        lede="Specifics are anonymised to respect client confidentiality. Ask me directly for detail relevant to your situation."
      />

      {CASE_STUDIES.map((study) => (
        <Section key={study.title} label={study.tag}>
          <p className="t-label">{study.discipline}</p>
          <h2 className="t-h2 mt-2 max-w-[24ch]">{study.title}</h2>
          <Account
            situation={study.situation}
            action={study.action}
            outcome={study.outcome}
          />
        </Section>
      ))}

      {/*
        Deliberately its own section rather than another entry above.
        Everything in that list is anonymised client work; PayReckon is a
        product David owns and operates, and presenting them as the same
        category would misrepresent both.
      */}
      <Section label="My own product" id="payreckon">
        <h2 className="t-h2 max-w-[24ch]">
          Not everything here was built for a client.
        </h2>
        <p className="t-body mt-6 max-w-[40rem]">
          PayReckon is a live product I designed, built, and run: UK take-home
          pay calculators comparing umbrella, limited company, and PAYE
          employment behind a single shared tax engine.
        </p>
        <p className="t-body mt-4 max-w-[40rem]">
          It is not security work. It is here because the discipline is the one
          I sell: correctness held by tests, every tax figure traceable to its
          source on gov.uk, and automated checks that fail the build rather than
          relying on someone remembering to look.
        </p>

        <h3 className="t-h3 mt-12">UK take-home pay, three ways</h3>
        <Account
          situation="A day rate and a salary are not comparable numbers, and comparing arrangements usually means three separate tools that disagree with one another."
          action="Built three calculators over one tax engine, so identical taxable income is taxed identically whichever arrangement produced it. The umbrella circularity (employment costs charged on the pay that remains after deducting them) is solved algebraically rather than approximated."
          outcome="Live at payreckon.co.uk and in active use, covering three tax years across Scottish and rest-of-UK rates. A round-trip test asserts that gross pay plus every employment cost returns the assignment rate exactly."
        />

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <PrimaryButton href="/payreckon">
            About PayReckon
            <ArrowRight size={16} aria-hidden="true" />
          </PrimaryButton>
          <ExternalTextLink href={PAYRECKON_URL}>Visit payreckon.co.uk</ExternalTextLink>
        </div>
      </Section>

      <Section label="Next step">
        <p className="max-w-[26ch] font-serif text-[clamp(1.8rem,1.1rem+2.6vw,3rem)] leading-[1.1] tracking-[-0.018em] text-ink">
          Want to talk through a situation like one of these?
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <PrimaryButton href="/contact">
            Start a conversation
            <ArrowRight size={16} aria-hidden="true" />
          </PrimaryButton>
          <TextLink href="/approach">How an engagement runs</TextLink>
        </div>
      </Section>
    </>
  );
}
