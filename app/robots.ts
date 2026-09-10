import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-links";

// Admin, order2party, and the unsubscribe link each carry their own
// `robots: noindex` metadata — Google's guidance is to let those be
// crawled (not blocked here) so it can actually see and obey that tag.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
