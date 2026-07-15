const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "Joy Trips";

const projectNameCompact = projectName.replace(/\s+/g, "");
const projectNameLower = projectName.toLowerCase();

// The canonical production domain - the purchased custom domain, not a
// Vercel-assigned subdomain. Every piece of SEO metadata (metadataBase,
// sitemap, robots.txt, canonical/OG URLs, JSON-LD) must derive from this
// single source so they can never drift to a stale or wrong domain again.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://joytrips.site").replace(/\/$/, "");

export const siteConfig = {
  projectName,
  projectNameCompact,
  projectNameLower,
  siteUrl,
};
