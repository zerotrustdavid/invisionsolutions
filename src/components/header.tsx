"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { LogoLockup } from "./logo";
import { WIDTH } from "./ui";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/approach", label: "Approach" },
  { href: "/case-studies", label: "Case studies" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/enquiries", label: "Enquiries" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      data-site-header
      className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-sm"
    >
      <div className={`${WIDTH} flex items-center justify-between py-4`}>
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="shrink-0"
        >
          {/* The lockup is an image of the name, so the accessible name comes
              from the text below, read by screen readers only. */}
          <LogoLockup className="h-6 sm:h-7" />
          <span className="sr-only">Invision Solutions, home</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const current = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`font-sans text-[0.9375rem] underline-offset-[0.5em] transition-colors hover:text-ink ${
                  current
                    ? "text-ink underline decoration-accent decoration-2"
                    : "text-slate"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className="rounded-[3px] border border-ink px-4 py-2.5 font-sans text-[0.9375rem] font-medium leading-none text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Start a conversation
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="p-1 text-ink lg:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-line lg:hidden"
        >
          <div className={`${WIDTH} flex flex-col py-2`}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`border-b border-line py-4 font-sans text-lg ${
                  pathname === link.href ? "text-ink" : "text-slate"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="py-4 font-sans text-lg font-medium text-ink"
            >
              Start a conversation
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export { Header };
