// app/(main)/bookings/[bookingId]/page.tsx
import type { JSX } from "react";
import { BookingDetail } from "@/features/bookings/components/BookingDetail";

type BookingDetailPageProps = {
	params: Promise<{ bookingId: string }>;
};

export default async function BookingDetailPage({
	params,
}: BookingDetailPageProps): Promise<JSX.Element> {
	const { bookingId } = await params;
	return <BookingDetail bookingId={bookingId} />;
}
