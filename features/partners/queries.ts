// features/partners/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getPartnerDetail, getPartnerList } from "@/features/partners/apis";
import type { PartnerCardItem, PartnerDetailItem } from "@/features/partners/types";
import { markNewPartners } from "@/features/partners/utils";

export const PARTNERS_QUERY_KEYS = {
	list: ["partners", "list"] as const,
	detail: function (profileId: string) {
		return ["partners", "detail", profileId] as const;
	},
};

export function usePartnerListQuery(): UseQueryResult<PartnerCardItem[]> {
	return useQuery({
		queryKey: PARTNERS_QUERY_KEYS.list,
		queryFn: getPartnerList,
		select: markNewPartners,
	});
}

export function usePartnerDetailQuery(profileId: string): UseQueryResult<PartnerDetailItem | null> {
	return useQuery({
		queryKey: PARTNERS_QUERY_KEYS.detail(profileId),
		queryFn: function () {
			return getPartnerDetail(profileId);
		},
	});
}
