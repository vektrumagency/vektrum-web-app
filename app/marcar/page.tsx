import type { Metadata } from "next";
import { BookingPageContent, getBookingMetadata } from "@/app/marcar/booking-content";

type BookingPageProps = {
  searchParams: Promise<{ name?: string; email?: string }>;
};

export const metadata: Metadata = getBookingMetadata("pt-PT");

export default async function MarcarPage({ searchParams }: BookingPageProps) {
  return <BookingPageContent locale="pt-PT" searchParams={searchParams} />;
}
