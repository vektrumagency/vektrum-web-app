import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order2Party Upload Portal",
  description: "Temporary upload portal for supplier Excel files.",
  robots: {
    index: false,
    follow: false
  }
};

export default function Order2PartyLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
