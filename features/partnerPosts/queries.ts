// features/partnerPosts/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getPartnerPosts } from "@/features/partnerPosts/apis";
import type { PartnerPost } from "@/features/partnerPosts/types";

export const PARTNER_POSTS_QUERY_KEYS = {
	list: function (partnerId: string) {
		return ["partnerPosts", "list", partnerId] as const;
	},
};

export function usePartnerPostsQuery(partnerId: string): UseQueryResult<PartnerPost[]> {
	return useQuery({
		queryKey: PARTNER_POSTS_QUERY_KEYS.list(partnerId),
		queryFn: function () {
			return getPartnerPosts(partnerId);
		},
		enabled: partnerId !== "",
	});
}
