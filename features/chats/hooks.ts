// features/chats/hooks.ts
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useMyBookingsQuery } from "@/features/bookings/queries";
import { CHATS_QUERY_KEYS, useChatRoomSummariesQuery } from "@/features/chats/queries";
import type { ChatMessage } from "@/features/chats/types";
import { createClient } from "@/libs/supabase/client";
import { useMyBlocksQuery } from "@/features/safety/queries";

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

// ChatRoomList의 rooms 필터(취소·거절 제외, 차단 상대 제외)와 동일 기준으로 안읽음 총합을 낸다
export function useUnreadChatTotal(): number {
	const { data: bookings } = useMyBookingsQuery();
	const { data: blocks } = useMyBlocksQuery();

	const blockedIds = new Set(
		(blocks ?? []).map(function (block) {
			return block.blocked_id;
		}),
	);
	const roomIds = (bookings ?? [])
		.filter(function (booking) {
			return (
				booking.status !== "canceled" &&
				booking.status !== "rejected" &&
				!blockedIds.has(booking.counterpartId)
			);
		})
		.map(function (booking) {
			return booking.id;
		});

	const { data: summaries } = useChatRoomSummariesQuery(roomIds);

	return Object.values(summaries ?? {}).reduce(function (total, summary) {
		return total + summary.unreadCount;
	}, 0);
}
