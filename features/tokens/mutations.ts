// features/tokens/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { postSpendToken } from "@/features/tokens/apis";
import { TOKENS_QUERY_KEYS } from "@/features/tokens/queries";

export function useSpendTokenMutation(): UseMutationResult<number, Error, string> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postSpendToken,
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: TOKENS_QUERY_KEYS.myBalance });
		},
	});
}
