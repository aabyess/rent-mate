// features/tokens/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { postCreateTokenPurchase, postSpendToken } from "@/features/tokens/apis";
import { TOKENS_QUERY_KEYS } from "@/features/tokens/queries";
import type { TokenProduct } from "@/features/tokens/products";

export function useCreateTokenPurchaseMutation(): UseMutationResult<string, Error, TokenProduct> {
	return useMutation({
		mutationFn: postCreateTokenPurchase,
	});
}

export function useSpendTokenMutation(): UseMutationResult<number, Error, string> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postSpendToken,
		// 실패(다른 기기 선사용 레이스)에도 잔액을 다시 읽어야 배지가 실제 값으로 수렴한다
		async onSettled(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: TOKENS_QUERY_KEYS.myBalance });
		},
	});
}
