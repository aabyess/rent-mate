// features/bookings/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getMyBookings } from "@/features/bookings/apis";
import type { MyBookingItem } from "@/features/bookings/types";

export const BOOKINGS_QUERY_KEYS = {
	myList: ["bookings", "myList"] as const,
};

export function useMyBookingsQuery(): UseQueryResult<MyBookingItem[]> {
	return useQuery({
		queryKey: BOOKINGS_QUERY_KEYS.myList,
		queryFn: getMyBookings,
	});
}
