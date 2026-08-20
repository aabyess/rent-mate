// features/preferences/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getMyPreferences } from "@/features/preferences/apis";
import type { CustomerPreferences } from "@/features/preferences/types";

export const PREFERENCES_QUERY_KEYS = {
	mine: ["preferences", "mine"] as const,
};

export function useMyPreferencesQuery(): UseQueryResult<CustomerPreferences | null> {
	return useQuery({
		queryKey: PREFERENCES_QUERY_KEYS.mine,
		queryFn: getMyPreferences,
	});
}
