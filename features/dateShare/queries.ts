// features/dateShare/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getSharedDate } from "@/features/dateShare/apis";
import type { SharedDateDetails } from "@/features/dateShare/types";

export const DATE_SHARE_QUERY_KEYS = {
	shared: function (token: string) {
		return ["dateShare", "shared", token] as const;
	},
};

export function useSharedDateQuery(token: string): UseQueryResult<SharedDateDetails | null> {
	return useQuery({
		queryKey: DATE_SHARE_QUERY_KEYS.shared(token),
		queryFn: function () {
			return getSharedDate(token);
		},
		enabled: token !== "",
		retry: false,
	});
}
