// features/tokens/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getMyTokenBalance } from "@/features/tokens/apis";

export const TOKENS_QUERY_KEYS = {
	myBalance: ["tokens", "myBalance"] as const,
};

export function useMyTokenBalanceQuery(): UseQueryResult<number> {
	return useQuery({
		queryKey: TOKENS_QUERY_KEYS.myBalance,
		queryFn: getMyTokenBalance,
	});
}
