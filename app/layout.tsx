import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vecktrum-agency.com"),
  title: "Vektrum | Free AI Audit for Business Automation",
  description:
    "Book a free AI audit with Vektrum to discover where AI automation, AI agents, and business process automation can save time in your company.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico"
  },
  openGraph: {
    title: "Vektrum | Free AI Audit for Business Automation",
    description:
      "Discover practical AI workflow automation opportunities for your business with a free AI audit from Vektrum.",
    url: "https://vecktrum-agency.com",
    siteName: "Vektrum",
    type: "website"
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background font-body text-text antialiased">
        {children}
      </body>
    </html>
  );
}
