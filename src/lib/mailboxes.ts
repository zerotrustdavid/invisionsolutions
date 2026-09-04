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

/**
 * The address that key delivers to, and the only address the site publishes.
 *
 * Every `mailto:` link on the site points here too. /services previously
 * published sales@ and /testimonials published hello@; both mailboxes are being
 * retired along with the per-department forms, so advertising them would leave
 * dead addresses on a live site. A mailto does not touch the Web3Forms account
 * at all, so this is about where mail can actually be read, not about the
 * linked-email allowance.
 */
export const PUBLIC_CONTACT_ADDRESS = "contact@invisionsolutions.co.uk";
