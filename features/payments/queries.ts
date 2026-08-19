// features/payments/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getPaymentStatusesByBookingIds } from "@/features/payments/apis";
import type { PaymentStatus } from "@/features/payments/types";

export const PAYMENTS_QUERY_KEYS = {
	statusesByBookingIds: function (bookingIds: string[]) {
		return ["payments", "statusesByBookingIds", [...bookingIds].sort()] as const;
	},
};

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
