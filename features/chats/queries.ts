// features/chats/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
	getChatImageSignedUrl,
	getChatMessages,
	getChatRoomSummaries,
} from "@/features/chats/apis";
import type { ChatMessage, ChatRoomSummary } from "@/features/chats/types";

export const CHATS_QUERY_KEYS = {
	messages: function (bookingId: string) {
		return ["chats", "messages", bookingId] as const;
	},
	roomSummariesRoot: ["chats", "roomSummaries"] as const,
	roomSummaries: function (bookingIds: string[]) {
		return ["chats", "roomSummaries", ...bookingIds] as const;
	},
	imageSignedUrl: function (imagePath: string) {
		return ["chats", "imageSignedUrl", imagePath] as const;
	},
};

// signed URL은 1시간 유효 — 여유를 두고 55분간은 재요청 없이 재사용한다
const IMAGE_SIGNED_URL_STALE_TIME_MS = 55 * 60 * 1000;

export function useChatImageSignedUrlQuery(imagePath: string): UseQueryResult<string> {
	return useQuery({
		queryKey: CHATS_QUERY_KEYS.imageSignedUrl(imagePath),
		queryFn: function () {
			return getChatImageSignedUrl(imagePath);
		},
		staleTime: IMAGE_SIGNED_URL_STALE_TIME_MS,
	});
}

export function useChatMessagesQuery(bookingId: string): UseQueryResult<ChatMessage[]> {
	return useQuery({
		queryKey: CHATS_QUERY_KEYS.messages(bookingId),
		queryFn: function () {
			return getChatMessages(bookingId);
		},
	});
}

export function useChatRoomSummariesQuery(
	bookingIds: string[],
): UseQueryResult<Record<string, ChatRoomSummary>> {
	const sortedIds = [...bookingIds].sort();
	return useQuery({
		queryKey: CHATS_QUERY_KEYS.roomSummaries(sortedIds),
		queryFn: function () {
			return getChatRoomSummaries(sortedIds);
		},
		enabled: sortedIds.length > 0,
	});
}
