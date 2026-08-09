/**
 * Enquiry routing.
 *
 * Web3Forms binds one access key to one form, and a form's recipients are set
 * in its dashboard — there is no client-side recipient override (that would
 * make the endpoint an open relay). So routing an enquiry to a specific mailbox
 * means a separate Web3Forms form, with its own access key, per mailbox.
 *
 * Each entry reads its own NEXT_PUBLIC_WEB3FORMS_KEY_* variable and falls back
 * to the general key when that variable is unset. The fallback delivers to
 * info@, which is the catch-all, so the page works before every form exists and
 * gets more precise as keys are added. Nothing silently disappears.
 *
 * NEXT_PUBLIC_ values are inlined at build time, so process.env cannot be
 * indexed dynamically here — each key must be written out literally.
 */

export type Mailbox = {
  slug: string;
  address: string;
  label: string;
  description: string;
  accessKey: string | undefined;
  /** The variable this mailbox's key comes from, for diagnostics. */
  keyName: string;
};

const GENERAL = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

export const MAILBOXES: Mailbox[] = [
  {
    slug: "sales",
    address: "sales@invisionsolutions.co.uk",
    label: "Sales & pricing",
    description:
      "Day rates, retainer pricing, and what a given scope is likely to cost.",
    accessKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY_SALES ?? GENERAL,
    keyName: "NEXT_PUBLIC_WEB3FORMS_KEY_SALES",
  },
  {
    slug: "contact",
    address: "contact@invisionsolutions.co.uk",
    label: "General enquiry",
    description:
      "Anything that does not fit the other routes — including introductions.",
    accessKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY_CONTACT ?? GENERAL,
    keyName: "NEXT_PUBLIC_WEB3FORMS_KEY_CONTACT",
  },
  {
    slug: "support",
    address: "support@invisionsolutions.co.uk",
    label: "Client support",
    description:
      "Existing engagements: questions on delivered work, handover, or documentation.",
    accessKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY_SUPPORT ?? GENERAL,
    keyName: "NEXT_PUBLIC_WEB3FORMS_KEY_SUPPORT",
  },
  {
    slug: "billing",
    address: "billing@invisionsolutions.co.uk",
    label: "Billing",
    description: "Payment terms, purchase orders, and billing arrangements.",
    accessKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY_BILLING ?? GENERAL,
    keyName: "NEXT_PUBLIC_WEB3FORMS_KEY_BILLING",
  },
  {
    slug: "invoice",
    address: "invoice@invisionsolutions.co.uk",
    label: "Invoices",
    description: "Invoice queries, copies, remittance advice, and corrections.",
    accessKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY_INVOICE ?? GENERAL,
    keyName: "NEXT_PUBLIC_WEB3FORMS_KEY_INVOICE",
  },
  {
    slug: "admin",
    address: "admin@invisionsolutions.co.uk",
    label: "Contracts & admin",
    description:
      "Supplier onboarding, NDAs, insurance certificates, and compliance paperwork.",
    accessKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY_ADMIN ?? GENERAL,
    keyName: "NEXT_PUBLIC_WEB3FORMS_KEY_ADMIN",
  },
  {
    slug: "hello",
    address: "hello@invisionsolutions.co.uk",
    label: "Partnerships & press",
    description:
      "Collaborations, speaking, podcasts, and anything media-related.",
    accessKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY_HELLO ?? GENERAL,
    keyName: "NEXT_PUBLIC_WEB3FORMS_KEY_HELLO",
  },
];

/**
 * The key the /contact form uses.
 *
 * It reuses the contact desk's form rather than reading the general key
 * directly, because every mailbox above has its own key set in production. That
 * means the `?? GENERAL` fallbacks never fire, and the general key was left
 * exercised by exactly one page: /contact. A fault in it was therefore invisible
 * on /enquiries, which is how the contact form came to fail while all seven
 * enquiry forms passed.
 *
 * Pointing /contact at the contact desk removes that blind spot. The form it
 * submits to is now the same one /enquiries exercises on every test, and it
 * delivers to PUBLIC_CONTACT_ADDRESS below, which is the address the contact
 * page already gives out.
 */
export const CONTACT_ACCESS_KEY =
  MAILBOXES.find((box) => box.slug === "contact")?.accessKey ?? GENERAL;

/** Named in the error state when CONTACT_ACCESS_KEY resolves to nothing. */
export const CONTACT_KEY_NAME =
  "NEXT_PUBLIC_WEB3FORMS_KEY_CONTACT (or NEXT_PUBLIC_WEB3FORMS_KEY)";

/** Address shown in the footer and as the general-purpose public address. */
export const PUBLIC_CONTACT_ADDRESS = "contact@invisionsolutions.co.uk";
export const SALES_ADDRESS = "sales@invisionsolutions.co.uk";
export const TESTIMONIALS_ADDRESS = "hello@invisionsolutions.co.uk";
