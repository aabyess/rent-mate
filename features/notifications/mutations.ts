// features/notifications/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { patchMarkNotificationRead } from "@/features/notifications/apis";
import { NOTIFICATIONS_QUERY_KEYS } from "@/features/notifications/queries";

export function useMarkNotificationReadMutation(): UseMutationResult<void, Error, string> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patchMarkNotificationRead,
		async onSuccess(): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.myList }),
				queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.unreadCount }),
			]);
		},
	});
}
