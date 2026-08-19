// features/chats/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { postChatMessage } from "@/features/chats/apis";
import { CHATS_QUERY_KEYS } from "@/features/chats/queries";
import type { SendChatMessageInput } from "@/features/chats/types";

export function useSendChatMessageMutation(
	bookingId: string,
): UseMutationResult<void, Error, SendChatMessageInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postChatMessage,
		async onSuccess(): Promise<void> {
			// Realtime 구독이 놓친 경우를 대비한 동기화
			await queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEYS.messages(bookingId) });
		},
	});
}
