import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Section, PageHead } from "@/components/ui";
import { PUBLIC_CONTACT_ADDRESS } from "@/lib/mailboxes";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description:
    "What I collect when you contact me through this site, why, who else handles it, how long I keep it, and your rights.",
  path: "/privacy",
});

const PROSE = "t-body max-w-[40rem]";
const HEADING = "t-h3 mt-12 first:mt-0";

export default function PrivacyPage() {
  return (
    <>
      <PageHead
        title="Privacy notice."
        lede="What I collect when you contact me through this site, why, who else handles it, and what your rights are."
      />

      <Section label="Privacy notice">
        <h2 className={HEADING}>Who I am</h2>
        <p className={`${PROSE} mt-4`}>
          I run Invision Solutions Ltd, company number 16056944, registered in
          England and Wales. In this notice, &ldquo;I&rdquo; means that company.
          You can reach me at{" "}
          <a href={`mailto:${PUBLIC_CONTACT_ADDRESS}`} className="link">
            {PUBLIC_CONTACT_ADDRESS}
          </a>
          .
        </p>

        <h2 className={HEADING}>What I collect</h2>
        <p className={`${PROSE} mt-4`}>
          When you send a message through the contact, enquiries or testimonial
          forms, I receive what you type into the form: your name, email
          address, company and message. The contact form also asks what kind of
          engagement you have in mind, and the testimonial form asks for your
          role and how you are happy for your words to be published. The form
          service also passes me the IP address the submission came from.
        </p>

        <h2 className={HEADING}>Why I use it, and my lawful basis</h2>
        <p className={`${PROSE} mt-4`}>
          I use it to reply to you and to discuss possible work. That is my
          legitimate interest in running a business and, where you ask me for
          something, a step towards a contract with you.
        </p>
        <p className={`${PROSE} mt-4`}>
          If you leave a testimonial, I publish it only in the way you choose in
          the form, and only after checking with you. That choice is your
          consent, and you can withdraw it at any time.
        </p>

        <h2 className={HEADING}>Who else handles it</h2>
        <p className={`${PROSE} mt-4`}>
          Submissions pass through Web3Forms, a form-processing service, which
          sends them on to my email inbox. It acts on my instructions and may
          process data outside the UK. This site is hosted on Vercel, which keeps
          the technical request logs that any host keeps, such as the page
          requested and the IP address it was requested from. I do not sell
          personal data and I do not use it for marketing.
        </p>

        <h2 className={HEADING}>How long I keep it</h2>
        <p className={`${PROSE} mt-4`}>
          I keep an enquiry for as long as the conversation is live, and for a
          limited time afterwards in case it picks up again. An enquiry that
          leads to no work is deleted once it stops being useful for that. If we
          do work together, records I am required by law to keep, such as those
          needed for tax, are kept for the period the law requires.
        </p>

        <h2 className={HEADING}>Cookies and tracking</h2>
        <p className={`${PROSE} mt-4`}>
          This site sets no cookies and runs no analytics, advertising or
          tracking scripts. Its fonts are served from the site itself, not from a
          third party.
        </p>

        <h2 className={HEADING}>Your rights</h2>
        <p className={`${PROSE} mt-4`}>
          You can ask me to show you what I hold about you, to correct it, to
          delete it, to restrict or stop how I use it, or to give you a copy in
          a portable form. Where I rely on your consent, you can withdraw it. To
          use any of these, email me at the address above and I will reply
          within one month.
        </p>
        <p className={`${PROSE} mt-4`}>
          If you are unhappy with how I have handled your data, you can complain
          to the Information Commissioner&rsquo;s Office at ico.org.uk. I would
          like the chance to put it right first.
        </p>

        <p className="t-label mt-14">Last updated 26 November 2026.</p>
      </Section>
    </>
  );
}
