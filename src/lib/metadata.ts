import type { Metadata } from "next";
import { SERVICES } from "@/lib/content";
import { PUBLIC_CONTACT_ADDRESS } from "@/lib/mailboxes";
import { PERSONAL_LINKEDIN_URL, SOCIAL_LINKS } from "@/components/social-icons";

/**
 * Canonical host. The apex 308-redirects to www in Vercel, so metadata must
 * point at www. Otherwise OG and canonical URLs resolve through a redirect
 * hop, which some social scrapers handle poorly.
 */
export const SITE_URL = "https://www.invisionsolutions.co.uk";

export const SITE_NAME = "Invision Solutions";

/**
 * Builds page metadata with a self-referencing canonical and a complete
 * Open Graph block.
 *
 * Next.js replaces the parent `openGraph` object wholesale rather than
 * deep-merging it, so a page that sets only `openGraph.url` silently drops
 * `siteName`, `locale`, and `type`. Every page therefore has to restate the
 * full set. This helper keeps that in one place.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_GB",
      type: "website",
    },
  };
}

/**
 * Structured data for the organisation and its founder.
 *
 * Built only from facts this site already states in public: the company name,
 * the public contact address, the founder's name and title, and the profiles
 * the footer already links to. It deliberately carries no address, no area
 * served, no ratings and no counts. Structured data that asserts something the
 * visible page does not is worse than none, and it is the first thing a
 * reviewer of a security consultancy's site would check.
 */
export const ORGANISATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organisation`,
  name: SITE_NAME,
  legalName: "Invision Solutions Ltd",
  url: SITE_URL,
  email: PUBLIC_CONTACT_ADDRESS,
  founder: {
    "@type": "Person",
    name: "David Levi",
    jobTitle: "Principal Consultant",
    url: `${SITE_URL}/approach`,
    sameAs: [PERSONAL_LINKEDIN_URL],
  },
  sameAs: SOCIAL_LINKS.map((link) => link.href),
  knowsAbout: SERVICES.map((service) => service.title),
};
