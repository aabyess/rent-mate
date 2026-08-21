// features/sportsMate/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
	getMySportsMatePosts,
	getMySportsMateRequests,
	getSportsMateMessages,
	getSportsMatePost,
	getSportsMatePostRequests,
	getSportsMatePosts,
	getSportsMateRequest,
} from "@/features/sportsMate/apis";
import type {
	MySportsMateRequestItem,
	SportsMateMessage,
	SportsMatePost,
	SportsMateRequest,
} from "@/features/sportsMate/types";

export const SPORTS_MATE_QUERY_KEYS = {
	list: ["sportsMate", "list"] as const,
	myList: ["sportsMate", "myList"] as const,
	detail: function (postId: string) {
		return ["sportsMate", "detail", postId] as const;
	},
	postRequests: function (postId: string) {
		return ["sportsMate", "postRequests", postId] as const;
	},
	requestDetail: function (requestId: string) {
		return ["sportsMate", "requestDetail", requestId] as const;
	},
	myRequests: ["sportsMate", "myRequests"] as const,
	messages: function (requestId: string) {
		return ["sportsMate", "messages", requestId] as const;
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

export function useSportsMatePostRequestsQuery(
	postId: string,
): UseQueryResult<SportsMateRequest[]> {
	return useQuery({
		queryKey: SPORTS_MATE_QUERY_KEYS.postRequests(postId),
		queryFn: function () {
			return getSportsMatePostRequests(postId);
		},
		enabled: postId !== "",
	});
}

export function useSportsMateRequestQuery(
	requestId: string,
): UseQueryResult<SportsMateRequest | null> {
	return useQuery({
		queryKey: SPORTS_MATE_QUERY_KEYS.requestDetail(requestId),
		queryFn: function () {
			return getSportsMateRequest(requestId);
		},
		enabled: requestId !== "",
	});
}

export function useMySportsMateRequestsQuery(): UseQueryResult<MySportsMateRequestItem[]> {
	return useQuery({
		queryKey: SPORTS_MATE_QUERY_KEYS.myRequests,
		queryFn: getMySportsMateRequests,
	});
}

export function useSportsMateMessagesQuery(requestId: string): UseQueryResult<SportsMateMessage[]> {
	return useQuery({
		queryKey: SPORTS_MATE_QUERY_KEYS.messages(requestId),
		queryFn: function () {
			return getSportsMateMessages(requestId);
		},
		enabled: requestId !== "",
	});
}
