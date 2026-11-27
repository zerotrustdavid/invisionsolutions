/**
 * The address the site publishes.
 *
 * Forms do not use it to decide where mail goes: they post to /api/enquiry,
 * which sends through Resend to ENQUIRY_TO, defaulting to this address. See
 * src/app/api/enquiry/route.ts, which is the one place the mail environment is
 * read.
 *
 * Before this the forms posted from the browser to a third-party form service
 * using a public key, with the recipient set in that service's dashboard. The
 * code could not see that setting, and on 27 November 2026 a form reported
 * "sent" while nothing arrived, with no way to tell why from here. Nothing reads
 * any NEXT_PUBLIC_WEB3FORMS_KEY* variable any more; delete them from the hosting
 * dashboard so a stale one cannot mislead anybody.
 */

/**
 * The only address the site publishes, and where enquiries are sent by default.
 *
 * Every `mailto:` link on the site points here too. /services previously
 * published sales@ and /testimonials published hello@; both mailboxes are being
 * retired along with the per-department forms, so advertising them would leave
 * dead addresses on a live site. A mailto links straight to the mailbox, so this
 * is about where mail can actually be read.
 */
export const PUBLIC_CONTACT_ADDRESS = "david@invisionsolutions.co.uk";
