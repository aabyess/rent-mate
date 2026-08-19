// app/(main)/(tabs)/bookings/page.tsx
import type { JSX } from "react";
import { MyBookingList } from "@/features/bookings/components/MyBookingList";

export default function BookingsPage(): JSX.Element {
	return (
		<main className="flex flex-col gap-4 px-5 py-4">
			<h1 className="text-[28px] font-bold">예약</h1>
			<MyBookingList />
		</main>
	);
}
