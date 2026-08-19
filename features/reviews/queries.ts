// features/reviews/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getMyReviewedBookingIds, getPartnerReviews } from "@/features/reviews/apis";
import type { ReviewRow } from "@/features/reviews/types";

export const REVIEWS_QUERY_KEYS = {
	partnerList: function (partnerId: string) {
		return ["reviews", "partnerList", partnerId] as const;
	},
	myReviewedBookingIds: ["reviews", "myReviewedBookingIds"] as const,
};

export function usePartnerReviewsQuery(partnerId: string): UseQueryResult<ReviewRow[]> {
	return useQuery({
		queryKey: REVIEWS_QUERY_KEYS.partnerList(partnerId),
		queryFn: function () {
			return getPartnerReviews(partnerId);
		},
	});
}

export function useMyReviewedBookingIdsQuery(): UseQueryResult<string[]> {
	return useQuery({
		queryKey: REVIEWS_QUERY_KEYS.myReviewedBookingIds,
		queryFn: getMyReviewedBookingIds,
	});
}
