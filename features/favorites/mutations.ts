// features/favorites/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { toggleBookmark, toggleLike } from "@/features/favorites/apis";
import { FAVORITES_QUERY_KEYS } from "@/features/favorites/queries";
import type { FavoriteState } from "@/features/favorites/types";

type ToggleInput = {
	partnerId: string;
	isOn: boolean;
};

type LikeMutationContext = {
	previousState: FavoriteState | undefined;
	previousCount: number | undefined;
};

// 하트는 "탭하면 즉시 채워짐"이 기대 동작이라 낙관적 업데이트 + 실패 시 롤백
export function useToggleLikeMutation(): UseMutationResult<
	void,
	Error,
	ToggleInput,
	LikeMutationContext
> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: function ({ partnerId, isOn }: ToggleInput) {
			return toggleLike(partnerId, isOn);
		},
		async onMutate({ partnerId, isOn }): Promise<LikeMutationContext> {
			const stateKey = FAVORITES_QUERY_KEYS.state(partnerId);
			const countKey = FAVORITES_QUERY_KEYS.likeCount(partnerId);
			await Promise.all([
				queryClient.cancelQueries({ queryKey: stateKey }),
				queryClient.cancelQueries({ queryKey: countKey }),
			]);
			const previousState = queryClient.getQueryData<FavoriteState>(stateKey);
			const previousCount = queryClient.getQueryData<number>(countKey);
			if (previousState) {
				queryClient.setQueryData<FavoriteState>(stateKey, {
					...previousState,
					isLiked: !isOn,
				});
			}
			if (previousCount !== undefined) {
				queryClient.setQueryData<number>(countKey, Math.max(0, previousCount + (isOn ? -1 : 1)));
			}
			return { previousState, previousCount };
		},
		onError(_error, { partnerId }, context): void {
			if (context?.previousState) {
				queryClient.setQueryData(FAVORITES_QUERY_KEYS.state(partnerId), context.previousState);
			}
			if (context?.previousCount !== undefined) {
				queryClient.setQueryData(FAVORITES_QUERY_KEYS.likeCount(partnerId), context.previousCount);
			}
		},
		async onSettled(_data, _error, { partnerId }): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEYS.state(partnerId) }),
				queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEYS.likeCount(partnerId) }),
			]);
		},
	});
}

export function useToggleBookmarkMutation(): UseMutationResult<void, Error, ToggleInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: function ({ partnerId, isOn }: ToggleInput) {
			return toggleBookmark(partnerId, isOn);
		},
		async onSuccess(_data, { partnerId }): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEYS.state(partnerId) }),
				queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEYS.bookmarkedList }),
			]);
		},
	});
}
