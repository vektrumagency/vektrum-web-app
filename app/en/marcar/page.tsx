import type { Metadata } from "next";
import { BookingPageContent, getBookingMetadata } from "@/app/marcar/booking-content";

type BookingPageProps = {
  searchParams: Promise<{ name?: string; email?: string }>;
};

export const metadata: Metadata = getBookingMetadata("en");

export default async function MarcarPageEn({ searchParams }: BookingPageProps) {
  return <BookingPageContent locale="en" searchParams={searchParams} />;
}
