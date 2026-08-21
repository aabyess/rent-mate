// features/sportsMate/hooks.ts
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { SPORTS_MATE_QUERY_KEYS } from "@/features/sportsMate/queries";
import type { SportsMateMessage } from "@/features/sportsMate/types";
import { createClient } from "@/libs/supabase/client";

// 매칭 채팅의 신규 메시지를 Realtime으로 받아 쿼리 캐시에 반영한다 (ChatRoom과 동일 패턴)
export function useSportsMateChatRealtime(requestId: string): void {
	const queryClient = useQueryClient();

	useEffect(
		function () {
			const supabase = createClient();
			const channel = supabase
				.channel(`sports-mate-chat-${requestId}`)
				.on(
					"postgres_changes",
					{
						event: "INSERT",
						schema: "public",
						table: "sports_mate_messages",
						filter: `request_id=eq.${requestId}`,
					},
					function (payload) {
						const message = payload.new as SportsMateMessage;
						queryClient.setQueryData<SportsMateMessage[]>(
							SPORTS_MATE_QUERY_KEYS.messages(requestId),
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
		[requestId, queryClient],
	);
}
