/**
 * Contact routing.
 *
 * There is one Web3Forms form behind this site, and one access key for it:
 * NEXT_PUBLIC_WEB3FORMS_KEY. Every form on the site — /contact, /enquiries and
 * the testimonial form on /testimonials — submits to it, and it delivers to
 * PUBLIC_CONTACT_ADDRESS.
 *
 * This used to be seven forms and eight keys, one per mailbox, because
 * Web3Forms binds one access key to one form and sets recipients per form in
 * its dashboard rather than from the client (a client-side recipient override
 * would make the endpoint an open relay). Those forms have been deleted from
 * the Web3Forms account, so the per-mailbox NEXT_PUBLIC_WEB3FORMS_KEY_*
 * variables now name forms that no longer exist.
 *
 * Nothing here reads those variables any more, deliberately. A stale
 * NEXT_PUBLIC_WEB3FORMS_KEY_* left set in Vercel is therefore inert rather than
 * live: it cannot be picked up and silently pointed at a deleted form. That is
 * the exact shape of the August /contact outage, where a key resolved to a
 * form that had been removed and submissions stopped delivering without any
 * visible error.
 *
 * Submissions are told apart by subject line, set per form at the call site.
 */

/** The access key every form on the site submits with. */
export const CONTACT_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

/** Named in the error state when CONTACT_ACCESS_KEY resolves to nothing. */
export const CONTACT_KEY_NAME = "NEXT_PUBLIC_WEB3FORMS_KEY";

/** The address that key delivers to, and the public address for the site. */
export const PUBLIC_CONTACT_ADDRESS = "contact@invisionsolutions.co.uk";

/**
 * Addresses published as `mailto:` links on /services and /testimonials.
 *
 * These are not Web3Forms recipients and never were — a mailto opens the
 * visitor's own mail client and goes straight to the address, so it does not
 * touch the Web3Forms account or its linked-email allowance. They are listed
 * here so that every address the site publishes is visible in one file.
 *
 * They are only worth keeping while those mailboxes actually receive mail.
 */
export const SALES_ADDRESS = "sales@invisionsolutions.co.uk";
export const TESTIMONIALS_ADDRESS = "hello@invisionsolutions.co.uk";
