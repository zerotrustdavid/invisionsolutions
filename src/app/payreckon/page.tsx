import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import {
  Section,
  PageHead,
  PrimaryButton,
  TextLink,
  ExternalPrimaryButton,
  ExternalTextLink,
  Rows,
  Row,
} from "@/components/ui";
import {
  PAYRECKON,
  PAYRECKON_CALCULATORS,
  PAYRECKON_RIGOUR,
  PAYRECKON_AUDIENCE,
  PAYRECKON_COVERAGE,
  PAYRECKON_DISCLAIMER,
  PAYRECKON_URL,
  PAYRECKON_FEEDBACK_URL,
  PAYRECKON_REPO_URL,
} from "@/lib/payreckon";

export const metadata: Metadata = pageMetadata({
  title: "PayReckon",
  description:
    "PayReckon is a UK take-home pay calculator that I built and run, comparing umbrella, limited company and PAYE employment behind a single tax engine.",
  path: "/payreckon",
});

export default function PayReckonPage() {
  return (
    <>
      <PageHead title="PayReckon." lede={PAYRECKON.tagline}>
        <p className="t-label mt-8">Live product, built and run by me</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-5">
          <ExternalPrimaryButton href={PAYRECKON_URL}>Open PayReckon</ExternalPrimaryButton>
          <ExternalTextLink href={PAYRECKON_REPO_URL}>Source on GitHub</ExternalTextLink>
        </div>
      </PageHead>

      <Section label="Coverage">
        <h2 className="t-h2 max-w-[24ch]">What it covers</h2>
        <ul className="mt-10 border-b border-line">
          {PAYRECKON_COVERAGE.map((item) => (
            <li
              key={item}
              className="border-t border-line py-4 font-serif text-[1.1875rem] leading-snug text-ink"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section label="The product">
        <h2 className="t-h2 max-w-[24ch]">
          Three arrangements, three different answers.
        </h2>
        <p className="t-body mt-6 max-w-[40rem]">{PAYRECKON.problem}</p>
        <h2 className="t-h2 mt-16 max-w-[24ch]">One tax engine behind all three.</h2>
        <p className="t-body mt-6 max-w-[40rem]">{PAYRECKON.built}</p>
      </Section>

      <Section label="The calculators">
        <h2 className="t-h2 max-w-[24ch]">Every route you can be paid through</h2>
        <div className="mt-12">
          <Rows>
            {PAYRECKON_CALCULATORS.map((calc) => (
              <Row key={calc.name} term={calc.route} hint={calc.name}>
                {calc.body}
              </Row>
            ))}
          </Rows>
        </div>
      </Section>

      <Section label="Why the numbers hold">
        <h2 className="t-h2 max-w-[24ch]">
          A calculator is only worth the rigour behind it.
        </h2>
        <div className="mt-12">
          <Rows>
            {PAYRECKON_RIGOUR.map((item) => (
              <Row key={item.title} term={item.title}>
                {item.body}
              </Row>
            ))}
          </Rows>
        </div>
      </Section>

      <Section label="Who uses it">
        <h2 className="t-h2 max-w-[24ch]">Built for people making the decision</h2>
        <div className="mt-12">
          <Rows>
            {PAYRECKON_AUDIENCE.map((item) => (
              <Row key={item.title} term={item.title}>
                {item.body}
              </Row>
            ))}
          </Rows>
        </div>
      </Section>

      <Section label="Why it is here">
        <h2 className="t-h2 max-w-[24ch]">Why it is on this site</h2>
        <p className="t-body mt-6 max-w-[40rem]">
          PayReckon is not a security product, and it is not client work. It is
          here because it is the same discipline applied to my own codebase:
          correctness held by tests rather than by care, every figure traceable
          to its source, and automated gates that fail the build rather than
          relying on someone remembering to check.
        </p>
        <p className="t-body mt-4 max-w-[40rem]">
          That is what I am asking clients to trust me with. This is where it is
          visible.
        </p>
      </Section>

      <Section label="Try it">
        <h2 className="t-h2 max-w-[24ch]">
          Work out what you would actually take home.
        </h2>
        <p className="t-body mt-6 max-w-[40rem]">
          Put your numbers in and compare all three arrangements side by side.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <ExternalPrimaryButton href={PAYRECKON_URL}>Open PayReckon</ExternalPrimaryButton>
          <ExternalTextLink href={PAYRECKON_FEEDBACK_URL}>Leave feedback</ExternalTextLink>
        </div>
        <p className="t-small mt-8 max-w-[40rem]">{PAYRECKON_DISCLAIMER}</p>
      </Section>

      <Section label="Security work">
        <h2 className="t-h2 max-w-[24ch]">Need the security side instead?</h2>
        <p className="t-body mt-6 max-w-[40rem]">
          Cybersecurity, DevSecOps and cloud architecture, delivered directly by
          me.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <PrimaryButton href="/contact">Start a conversation</PrimaryButton>
          <TextLink href="/case-studies">See consultancy work</TextLink>
        </div>
      </Section>
    </>
  );
}
