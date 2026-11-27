import { SITE_URL } from "@/lib/metadata";
import { PUBLIC_CONTACT_ADDRESS } from "@/lib/mailboxes";

/**
 * RFC 9116 security.txt.
 *
 * A security consultancy without one is conspicuous, and it is the first place
 * a researcher looks for how to report something.
 *
 * `Expires` is required by the RFC and must be under a year out. This route is
 * statically generated, so the date is computed at build time and is therefore
 * refreshed by every deployment. It lapses only if the site goes about ten
 * months without being redeployed, which is the failure to watch for: an
 * expired security.txt is treated by tooling as absent.
 */
export const dynamic = "force-static";

const VALID_FOR_DAYS = 300;

export function GET() {
  const expires = new Date(
    Date.now() + VALID_FOR_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const body =
    [
      `Contact: mailto:${PUBLIC_CONTACT_ADDRESS}`,
      `Expires: ${expires}`,
      "Preferred-Languages: en",
      `Canonical: ${SITE_URL}/.well-known/security.txt`,
    ].join("\n") + "\n";

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
