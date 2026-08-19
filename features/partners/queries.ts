// features/partners/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getPartnerList } from "@/features/partners/apis";
import type { PartnerCardItem } from "@/features/partners/types";
import { markNewPartners } from "@/features/partners/utils";

export const PARTNERS_QUERY_KEYS = {
	list: ["partners", "list"] as const,
};

export function usePartnerListQuery(): UseQueryResult<PartnerCardItem[]> {
	return useQuery({
		queryKey: PARTNERS_QUERY_KEYS.list,
		queryFn: getPartnerList,
		select: markNewPartners,
	});
}
