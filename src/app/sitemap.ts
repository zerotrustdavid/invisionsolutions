import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

/**
 * Every public route. Kept as an explicit list rather than discovered, so a new
 * page does not silently enter the index before it is ready, and a removed page
 * is a one-line deletion that is easy to spot in review.
 *
 * `lastModified` is deliberately omitted. A value that changes on every build
 * tells crawlers every page changed every time, which teaches them to ignore it.
 */
const ROUTES = [
  "/",
  "/services",
  "/approach",
  "/case-studies",
  "/payreckon",
  "/testimonials",
  "/enquiries",
  "/contact",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
  }));
}
