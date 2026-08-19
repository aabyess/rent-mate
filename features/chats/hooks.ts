// features/chats/hooks.ts
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CHATS_QUERY_KEYS } from "@/features/chats/queries";
import type { ChatMessage } from "@/features/chats/types";
import { createClient } from "@/libs/supabase/client";

// booking 채팅방의 신규 메시지를 Realtime으로 받아 쿼리 캐시에 반영한다
export function useChatRoomRealtime(bookingId: string): void {
	const queryClient = useQueryClient();

	useEffect(
		function () {
			const supabase = createClient();
			const channel = supabase
				.channel(`chat-${bookingId}`)
				.on(
					"postgres_changes",
					{
						event: "INSERT",
						schema: "public",
						table: "chat_messages",
						filter: `booking_id=eq.${bookingId}`,
					},
					function (payload) {
						const message = payload.new as ChatMessage;
						queryClient.setQueryData<ChatMessage[]>(
							CHATS_QUERY_KEYS.messages(bookingId),
							function (old) {
								if (!old) {
									return [message];
								}
								if (
									old.some(function (item) {
										return item.id === message.id;
									})
								) {
									return old;
								}
								return [...old, message];
							},
						);
					},
				)
				.subscribe();

			return function () {
				void supabase.removeChannel(channel);
			};
		},
		[bookingId, queryClient],
	);
}
