import Link from "next/link";
import { LogoLockup } from "./logo";
import { SocialLinks } from "./social-icons";
import { WIDTH } from "./ui";
import { PUBLIC_CONTACT_ADDRESS } from "@/lib/mailboxes";

const SITE_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/approach", label: "Approach" },
  { href: "/case-studies", label: "Case studies" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/payreckon", label: "PayReckon" },
];

const CONTACT_LINKS = [
  { href: "/contact", label: "Start a conversation" },
  { href: "/enquiries", label: "Enquiries" },
];

const linkClass =
  "font-sans text-[0.9375rem] text-slate transition-colors hover:text-ink";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className={`${WIDTH} py-16`}>
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div className="max-w-sm">
            <LogoLockup size={20} />
            <p className="t-small mt-5">
              Cybersecurity, DevSecOps and cloud consultancy. I am the
              principal consultant, and I do the work myself.
            </p>
            <SocialLinks className="mt-6" />
          </div>

          <nav aria-label="Site" className="flex flex-col gap-3">
            <p className="t-label">Site</p>
            {SITE_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Contact" className="flex flex-col gap-3">
            <p className="t-label">Contact</p>
            {CONTACT_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
            <a href={`mailto:${PUBLIC_CONTACT_ADDRESS}`} className="link font-sans text-[0.9375rem]">
              {PUBLIC_CONTACT_ADDRESS}
            </a>
          </nav>

          <div className="flex flex-col gap-3">
            <p className="t-label">Company</p>
            <p className="t-small">
              Invision Solutions Ltd
              <br />
              Company No. 16056944
              <br />
              England &amp; Wales
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-label">
            © {year} Invision Solutions Ltd. All rights reserved.
          </p>
          <Link href="/privacy" className={linkClass}>
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
