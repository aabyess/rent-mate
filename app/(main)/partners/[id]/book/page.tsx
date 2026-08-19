// app/(main)/partners/[id]/book/page.tsx
import type { JSX } from "react";
import { BookingFlow } from "@/features/bookings/components/BookingFlow";

type BookingPageProps = {
	params: Promise<{ id: string }>;
};

export default async function BookingPage({ params }: BookingPageProps): Promise<JSX.Element> {
	const { id } = await params;
	return <BookingFlow partnerId={id} />;
}
