// features/favorites/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
	getMyBookmarkedPartners,
	getMyFavoriteState,
	getPartnerLikeCount,
} from "@/features/favorites/apis";
import type { BookmarkedPartner, FavoriteState } from "@/features/favorites/types";

export const FAVORITES_QUERY_KEYS = {
	state: function (partnerId: string) {
		return ["favorites", "state", partnerId] as const;
	},
	likeCount: function (partnerId: string) {
		return ["favorites", "likeCount", partnerId] as const;
	},
	bookmarkedList: ["favorites", "bookmarkedList"] as const,
};

export function useFavoriteStateQuery(partnerId: string): UseQueryResult<FavoriteState> {
	return useQuery({
		queryKey: FAVORITES_QUERY_KEYS.state(partnerId),
		queryFn: function () {
			return getMyFavoriteState(partnerId);
		},
		enabled: partnerId !== "",
	});
}

export function usePartnerLikeCountQuery(partnerId: string): UseQueryResult<number> {
	return useQuery({
		queryKey: FAVORITES_QUERY_KEYS.likeCount(partnerId),
		queryFn: function () {
			return getPartnerLikeCount(partnerId);
		},
		enabled: partnerId !== "",
	});
}

export function useMyBookmarkedPartnersQuery(): UseQueryResult<BookmarkedPartner[]> {
	return useQuery({
		queryKey: FAVORITES_QUERY_KEYS.bookmarkedList,
		queryFn: getMyBookmarkedPartners,
	});
}
