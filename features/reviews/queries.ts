// features/reviews/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
	getMyReviewedBookingIds,
	getMyReviews,
	getPartnerRatingSummaries,
	getPartnerReviews,
} from "@/features/reviews/apis";
import type { MyReviewItem, PartnerRatingSummary, ReviewRow } from "@/features/reviews/types";

export const REVIEWS_QUERY_KEYS = {
	partnerList: function (partnerId: string) {
		return ["reviews", "partnerList", partnerId] as const;
	},
	myReviewedBookingIds: ["reviews", "myReviewedBookingIds"] as const,
	myReviews: ["reviews", "myReviews"] as const,
	ratingSummaries: function (partnerIds: string[]) {
		return ["reviews", "ratingSummaries", ...partnerIds] as const;
	},
};

export function useMyReviewsQuery(): UseQueryResult<MyReviewItem[]> {
	return useQuery({
		queryKey: REVIEWS_QUERY_KEYS.myReviews,
		queryFn: getMyReviews,
	});
}

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

export function usePartnerRatingsQuery(
	partnerIds: string[],
): UseQueryResult<Record<string, PartnerRatingSummary>> {
	const sortedIds = [...partnerIds].sort();
	return useQuery({
		queryKey: REVIEWS_QUERY_KEYS.ratingSummaries(sortedIds),
		queryFn: function () {
			return getPartnerRatingSummaries(sortedIds);
		},
		enabled: sortedIds.length > 0,
	});
}
