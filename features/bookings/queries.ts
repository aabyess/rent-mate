// features/bookings/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getBookingDetail, getMyBookings } from "@/features/bookings/apis";
import type { MyBookingItem } from "@/features/bookings/types";

export const BOOKINGS_QUERY_KEYS = {
	myList: ["bookings", "myList"] as const,
	detail: function (bookingId: string) {
		return ["bookings", "detail", bookingId] as const;
	},
};

export function useBookingDetailQuery(bookingId: string): UseQueryResult<MyBookingItem | null> {
	return useQuery({
		queryKey: BOOKINGS_QUERY_KEYS.detail(bookingId),
		queryFn: function () {
			return getBookingDetail(bookingId);
		},
	});
}

export function useMyBookingsQuery(): UseQueryResult<MyBookingItem[]> {
	return useQuery({
		queryKey: BOOKINGS_QUERY_KEYS.myList,
		queryFn: getMyBookings,
	});
}
