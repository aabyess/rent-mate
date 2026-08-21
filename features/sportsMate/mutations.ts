// features/sportsMate/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import {
	patchSportsMatePost,
	patchSportsMatePostStatus,
	postCreateSportsMatePost,
} from "@/features/sportsMate/apis";
import { SPORTS_MATE_QUERY_KEYS } from "@/features/sportsMate/queries";
import type {
	PatchSportsMatePostStatusInput,
	SportsMatePostInput,
} from "@/features/sportsMate/types";

export function useCreateSportsMatePostMutation(): UseMutationResult<
	void,
	Error,
	SportsMatePostInput
> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCreateSportsMatePost,
		async onSuccess(): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: SPORTS_MATE_QUERY_KEYS.list }),
				queryClient.invalidateQueries({ queryKey: SPORTS_MATE_QUERY_KEYS.myList }),
			]);
		},
	});
}

export function usePatchSportsMatePostMutation(
	postId: string,
): UseMutationResult<void, Error, SportsMatePostInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: function (input: SportsMatePostInput) {
			return patchSportsMatePost(postId, input);
		},
		async onSuccess(): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: SPORTS_MATE_QUERY_KEYS.list }),
				queryClient.invalidateQueries({ queryKey: SPORTS_MATE_QUERY_KEYS.myList }),
				queryClient.invalidateQueries({ queryKey: SPORTS_MATE_QUERY_KEYS.detail(postId) }),
			]);
		},
	});
}

export function usePatchSportsMatePostStatusMutation(): UseMutationResult<
	void,
	Error,
	PatchSportsMatePostStatusInput
> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patchSportsMatePostStatus,
		async onSuccess(_data, variables): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: SPORTS_MATE_QUERY_KEYS.list }),
				queryClient.invalidateQueries({ queryKey: SPORTS_MATE_QUERY_KEYS.myList }),
				queryClient.invalidateQueries({
					queryKey: SPORTS_MATE_QUERY_KEYS.detail(variables.postId),
				}),
			]);
		},
	});
}
