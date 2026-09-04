import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { Reveal } from "@/components/reveal";
import { Section, Eyebrow, SurfaceCard, PrimaryButton } from "@/components/ui";
import { SERVICES } from "@/lib/content";
import { PUBLIC_CONTACT_ADDRESS } from "@/lib/mailboxes";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Cloud security architecture, DevSecOps, SIEM engineering, compliance, and fractional security leadership — five ways to work with Invision Solutions.",
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
      <Section className="pt-20 sm:pt-24">
        <Reveal>
          <Eyebrow>Services</Eyebrow>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Five ways to work together — as a one-off assessment, an embedded
            build, or ongoing advisory.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate">
            Every engagement is scoped directly with David, not a sales team.
          </p>
        </Reveal>
      </Section>

      <Section className="!pt-0">
        <div className="grid gap-6 lg:grid-cols-2">
          {SERVICES.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.07}>
              <SurfaceCard className="h-full">
                <span className="font-mono text-xs text-gold-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-ink">
                  {service.title}
                </h2>
                <p className="mt-4 leading-relaxed text-slate">{service.summary}</p>
              </SurfaceCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="panel" className="border-t border-line">
        <Reveal>
          <Eyebrow>Engagement Models</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            How the work is structured.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {ENGAGEMENT_MODELS.map((model, i) => (
            <Reveal key={model.title} delay={i * 0.1}>
              <SurfaceCard raised className="h-full">
                <h3 className="font-display text-lg font-medium text-ink">
                  {model.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate">{model.body}</p>
              </SurfaceCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-10 text-sm leading-relaxed text-slate">
            Pricing question? Day rates and retainer costs go to{" "}
            <a
              href={`mailto:${PUBLIC_CONTACT_ADDRESS}`}
              className="text-blue-ink underline decoration-blue-ink/30 underline-offset-4 hover:decoration-blue-ink"
            >
              {PUBLIC_CONTACT_ADDRESS}
            </a>
            .
          </p>
        </Reveal>
      </Section>

      <Section>
        <Reveal className="surface rounded-2xl px-8 py-14 text-center sm:px-16">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Not sure which model fits? Let&apos;s talk it through.
          </h2>
          <div className="mt-8 flex justify-center">
            <PrimaryButton href="/contact">
              Start a conversation
              <ArrowRight size={16} />
            </PrimaryButton>
          </div>
          <p className="mt-6 text-sm text-slate">
            Or email{" "}
            <a
              href={`mailto:${PUBLIC_CONTACT_ADDRESS}`}
              className="text-blue-ink underline decoration-blue-ink/30 underline-offset-4 hover:decoration-blue-ink"
            >
              {PUBLIC_CONTACT_ADDRESS}
            </a>
            .
          </p>
        </Reveal>
      </Section>
    </>
  );
}
