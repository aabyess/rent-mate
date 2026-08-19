// features/chats/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getChatMessages, getChatRoomSummaries } from "@/features/chats/apis";
import type { ChatMessage, ChatRoomSummary } from "@/features/chats/types";

export const CHATS_QUERY_KEYS = {
	messages: function (bookingId: string) {
		return ["chats", "messages", bookingId] as const;
	},
	roomSummariesRoot: ["chats", "roomSummaries"] as const,
	roomSummaries: function (bookingIds: string[]) {
		return ["chats", "roomSummaries", ...bookingIds] as const;
	},
};

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
