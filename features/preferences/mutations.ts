// features/preferences/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { postSkipPreferences, putMyPreferences } from "@/features/preferences/apis";
import { PREFERENCES_QUERY_KEYS } from "@/features/preferences/queries";
import type { SavePreferencesInput } from "@/features/preferences/types";

export function useSavePreferencesMutation(): UseMutationResult<void, Error, SavePreferencesInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: putMyPreferences,
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: PREFERENCES_QUERY_KEYS.mine });
		},
	});
}

export function useSkipPreferencesMutation(): UseMutationResult<void, Error, void> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postSkipPreferences,
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: PREFERENCES_QUERY_KEYS.mine });
		},
	});
}
