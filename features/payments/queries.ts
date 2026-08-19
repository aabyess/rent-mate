// features/payments/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getPaymentByBookingId, getPaymentStatusesByBookingIds } from "@/features/payments/apis";
import type { PaymentRow, PaymentStatus } from "@/features/payments/types";

export const PAYMENTS_QUERY_KEYS = {
	statusesByBookingIds: function (bookingIds: string[]) {
		return ["payments", "statusesByBookingIds", [...bookingIds].sort()] as const;
	},
	byBookingId: function (bookingId: string) {
		return ["payments", "byBookingId", bookingId] as const;
	},
};

export function usePaymentByBookingIdQuery(bookingId: string): UseQueryResult<PaymentRow | null> {
	return useQuery({
		queryKey: PAYMENTS_QUERY_KEYS.byBookingId(bookingId),
		queryFn: function () {
			return getPaymentByBookingId(bookingId);
		},
	});
}

export function usePaymentStatusesQuery(
	bookingIds: string[],
): UseQueryResult<Record<string, PaymentStatus>> {
	return useQuery({
		queryKey: PAYMENTS_QUERY_KEYS.statusesByBookingIds(bookingIds),
		queryFn: function () {
			return getPaymentStatusesByBookingIds(bookingIds);
		},
	});
}
