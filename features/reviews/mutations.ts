// features/reviews/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { postNotifyEvent } from "@/features/notifications/apis";
import { postCreateReview } from "@/features/reviews/apis";
import { REVIEWS_QUERY_KEYS } from "@/features/reviews/queries";
import type { CreateReviewInput } from "@/features/reviews/types";

export function useCreateReviewMutation(): UseMutationResult<void, Error, CreateReviewInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCreateReview,
		async onSuccess(_data, { partnerId, bookingId }): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.myReviewedBookingIds }),
				queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.partnerList(partnerId) }),
			]);
			void postNotifyEvent({ type: "review_received", bookingId });
		},
	});
}
