// features/reviews/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { postNotifyEvent } from "@/features/notifications/apis";
import { postCreateReview } from "@/features/reviews/apis";
import { REVIEWS_QUERY_KEYS } from "@/features/reviews/queries";
import type { CreateReviewInput } from "@/features/reviews/types";
import { TOKENS_QUERY_KEYS } from "@/features/tokens/queries";

export function useCreateReviewMutation(): UseMutationResult<void, Error, CreateReviewInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCreateReview,
		async onSuccess(_data, { partnerId, bookingId }): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.myReviewedBookingIds }),
				queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.partnerList(partnerId) }),
				queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.byBookingId(bookingId) }),
				// 20자 이상이면 DB 트리거가 토큰을 지급한다 — 지갑 잔액을 즉시 반영한다
				queryClient.invalidateQueries({ queryKey: TOKENS_QUERY_KEYS.myBalance }),
			]);
			void postNotifyEvent({ type: "review_received", bookingId });
		},
	});
}
