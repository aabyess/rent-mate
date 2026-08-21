// features/sportsMate/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
	getMySportsMatePosts,
	getSportsMatePost,
	getSportsMatePosts,
} from "@/features/sportsMate/apis";
import type { SportsMatePost } from "@/features/sportsMate/types";

export const SPORTS_MATE_QUERY_KEYS = {
	list: ["sportsMate", "list"] as const,
	myList: ["sportsMate", "myList"] as const,
	detail: function (postId: string) {
		return ["sportsMate", "detail", postId] as const;
	},
};

export function useSportsMatePostsQuery(): UseQueryResult<SportsMatePost[]> {
	return useQuery({
		queryKey: SPORTS_MATE_QUERY_KEYS.list,
		queryFn: getSportsMatePosts,
	});
}

export function useMySportsMatePostsQuery(): UseQueryResult<SportsMatePost[]> {
	return useQuery({
		queryKey: SPORTS_MATE_QUERY_KEYS.myList,
		queryFn: getMySportsMatePosts,
	});
}

export function useSportsMatePostQuery(postId: string): UseQueryResult<SportsMatePost | null> {
	return useQuery({
		queryKey: SPORTS_MATE_QUERY_KEYS.detail(postId),
		queryFn: function () {
			return getSportsMatePost(postId);
		},
		enabled: postId !== "",
	});
}
