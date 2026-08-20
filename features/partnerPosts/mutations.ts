// features/partnerPosts/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { deletePartnerPost, postCreatePartnerPost } from "@/features/partnerPosts/apis";
import type { CreatePartnerPostInput } from "@/features/partnerPosts/types";

export function useCreatePartnerPostMutation(
	partnerId: string,
): UseMutationResult<void, Error, CreatePartnerPostInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCreatePartnerPost,
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: ["partnerPosts", "list", partnerId] });
		},
	});
}

export function useDeletePartnerPostMutation(
	partnerId: string,
): UseMutationResult<void, Error, string> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deletePartnerPost,
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: ["partnerPosts", "list", partnerId] });
		},
	});
}
