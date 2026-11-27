import type { Metadata, Viewport } from "next";
import { Newsreader, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SITE_URL, SITE_NAME, ORGANISATION_JSON_LD } from "@/lib/metadata";
import "./globals.css";

/*
 * Newsreader carries the headings and the prose. It is drawn for reading, with
 * an optical-size axis, so it holds up at body size and still looks like a
 * display face when large.
 */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/*
 * The wordmark's face. Used by the logo lockup and nothing else: the mark is one
 * version with no variants, and its type is part of it, so it must not move when
 * the site's typography does. Weights are exactly the ones the logo has always
 * loaded.
 */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const TITLE = "Invision Solutions | Cybersecurity, DevSecOps and cloud consultancy";
const DESCRIPTION =
  "I am a cybersecurity, DevSecOps and cloud consultant. Invision Solutions is my consultancy: senior-level work, done by me, with nobody in between.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: {
    default: TITLE,
    template: "%s | Invision Solutions",
  },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

/*
 * Both schemes are declared: the page has a designed light theme and a designed
 * dark theme, and this tells the browser so. It is not claimed to prevent a
 * browser or extension from force-darkening the page; that could not be
 * reproduced in testing.
 */
export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ed" },
    { media: "(prefers-color-scheme: dark)", color: "#15130f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${newsreader.variable} ${ibmPlexSans.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          data-skip-link
          className="sr-only z-[60] rounded-[3px] bg-ink px-4 py-3 font-sans text-sm font-medium text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        {/* Static, build-time data only. No visitor input reaches this. */}
        <script type="application/ld+json">{JSON.stringify(ORGANISATION_JSON_LD)}</script>
      </body>
    </html>
  );
}
