// features/chats/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getChatMessages } from "@/features/chats/apis";
import type { ChatMessage } from "@/features/chats/types";

export const CHATS_QUERY_KEYS = {
	messages: function (bookingId: string) {
		return ["chats", "messages", bookingId] as const;
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
