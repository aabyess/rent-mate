// features/bookings/components/BookingRealtimeListener/index.tsx
"use client";

import { useMyProfileQuery } from "@/features/auth/queries";
import { useBookingRealtimeNotifications } from "@/features/bookings/hooks";

export function BookingRealtimeListener(): null {
	const { data: profile } = useMyProfileQuery();
	useBookingRealtimeNotifications(profile?.id ?? "");
	return null;
}
