import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vecktrum-agency.com"),
  title: "Vektrum | Practical Business Automation Systems",
  description:
    "Vektrum designs practical automation systems that save time, reduce manual work, and help businesses operate faster.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico"
  },
  openGraph: {
    title: "Vektrum | Practical Business Automation Systems",
    description:
      "Automation systems for lead handling, customer support, reporting, CRM updates, admin workflows, and follow-ups.",
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
