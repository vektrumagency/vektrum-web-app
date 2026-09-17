import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Anton, Inter } from "next/font/google";
import { headers } from "next/headers";
import { SITE_URL } from "@/lib/site-links";
import "./globals.css";

const displayFont = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display"
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Vektrum | Practical Business Automation Systems",
  description:
    "Vektrum designs practical automation systems that save time, reduce manual work, and help businesses operate faster.",
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
    apple: [{ url: "/vektrum-icon.png", type: "image/png" }]
  },
  openGraph: {
    title: "Vektrum | Practical Business Automation Systems",
    description:
      "Automation systems for lead handling, customer support, reporting, CRM updates, admin workflows, and follow-ups.",
    url: SITE_URL,
    siteName: "Vektrum",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Vektrum | Practical Business Automation Systems",
    description:
      "Vektrum designs practical automation systems that save time, reduce manual work, and help businesses operate faster."
  },
  alternates: {
    canonical: "/"
  }
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Vektrum",
  url: SITE_URL,
  logo: `${SITE_URL}/vektrum-icon.png`,
  email: "vektrum.agency@gmail.com",
  description:
    "Vektrum designs practical automation systems that save time, reduce manual work, and help businesses operate faster."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  // proxy.ts sets this from the request path (/en/... vs everything else)
  // so the root layout — which has no access to the route's own params —
  // can still render the correct <html lang> on the first server response.
  const headersList = await headers();
  const lang = headersList.get("x-locale") === "en" ? "en" : "pt-PT";

  return (
    <html lang={lang} className={`${displayFont.variable} ${bodyFont.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="bg-background font-body text-text antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
