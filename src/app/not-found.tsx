import { PageHead, Section, TextLink } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <PageHead
        title="Page not found."
        lede="That page does not exist, or it has moved. The pages I would point you to are below."
      />
      <Section label="Where to go">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <TextLink href="/">Home</TextLink>
          <TextLink href="/services">Services</TextLink>
          <TextLink href="/case-studies">Case studies</TextLink>
          <TextLink href="/contact">Contact</TextLink>
        </div>
      </Section>
    </>
  );
}
