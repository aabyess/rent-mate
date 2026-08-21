// features/sportsMate/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import {
	patchSportsMatePost,
	patchSportsMatePostStatus,
	patchSportsMateRequestStatus,
	postAcceptSportsMateRequest,
	postCreateSportsMatePost,
	postCreateSportsMateRequest,
	postSportsMateMessage,
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

export function useCreateSportsMateRequestMutation(): UseMutationResult<void, Error, string> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCreateSportsMateRequest,
		async onSuccess(): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: SPORTS_MATE_QUERY_KEYS.list }),
				queryClient.invalidateQueries({ queryKey: SPORTS_MATE_QUERY_KEYS.myRequests }),
			]);
		},
	});
}

type PatchSportsMateRequestStatusInput = {
	requestId: string;
	status: "declined" | "cancelled";
};

export function usePatchSportsMateRequestStatusMutation(
	postId: string,
): UseMutationResult<void, Error, PatchSportsMateRequestStatusInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: function ({ requestId, status }: PatchSportsMateRequestStatusInput) {
			return patchSportsMateRequestStatus(requestId, status);
		},
		async onSuccess(): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: SPORTS_MATE_QUERY_KEYS.postRequests(postId) }),
				queryClient.invalidateQueries({ queryKey: SPORTS_MATE_QUERY_KEYS.myRequests }),
			]);
		},
	});
}

export function useAcceptSportsMateRequestMutation(
	postId: string,
): UseMutationResult<void, Error, string> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postAcceptSportsMateRequest,
		async onSuccess(): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: SPORTS_MATE_QUERY_KEYS.postRequests(postId) }),
				queryClient.invalidateQueries({ queryKey: SPORTS_MATE_QUERY_KEYS.myList }),
				queryClient.invalidateQueries({ queryKey: SPORTS_MATE_QUERY_KEYS.detail(postId) }),
			]);
		},
	});
}

export function useSendSportsMateMessageMutation(
	requestId: string,
): UseMutationResult<void, Error, string> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: function (content: string) {
			return postSportsMateMessage(requestId, content);
		},
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: SPORTS_MATE_QUERY_KEYS.messages(requestId) });
		},
	});
}
