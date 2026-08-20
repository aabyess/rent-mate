// features/favorites/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { toggleBookmark, toggleLike } from "@/features/favorites/apis";
import { FAVORITES_QUERY_KEYS } from "@/features/favorites/queries";

type ToggleInput = {
	partnerId: string;
	isOn: boolean;
};

export function useToggleLikeMutation(): UseMutationResult<void, Error, ToggleInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: function ({ partnerId, isOn }: ToggleInput) {
			return toggleLike(partnerId, isOn);
		},
		async onSuccess(_data, { partnerId }): Promise<void> {
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
