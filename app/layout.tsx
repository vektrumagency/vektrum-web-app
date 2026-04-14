import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vecktrum-agency.com"),
  title: "Vektrum | AI Automation Agency",
  description:
    "Vektrum helps businesses automate operations, deploy custom AI workflows, and scale with practical systems.",
  icons: {
    icon: "/vektrum-favicon-20260414.ico",
    shortcut: "/vektrum-favicon-20260414.ico"
  },
  openGraph: {
    title: "Vektrum | AI Automation Agency",
    description:
      "Premium AI automation systems for teams that want to save time, reduce manual work, and scale faster.",
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
