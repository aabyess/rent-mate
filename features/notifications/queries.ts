// features/notifications/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getMyNotifications, getUnreadNotificationCount } from "@/features/notifications/apis";
import type { NotificationRow } from "@/features/notifications/types";

export const NOTIFICATIONS_QUERY_KEYS = {
	myList: ["notifications", "myList"] as const,
	unreadCount: ["notifications", "unreadCount"] as const,
};

export function useMyNotificationsQuery(): UseQueryResult<NotificationRow[]> {
	return useQuery({
		queryKey: NOTIFICATIONS_QUERY_KEYS.myList,
		queryFn: getMyNotifications,
	});
}

export function useUnreadNotificationCountQuery(): UseQueryResult<number> {
	return useQuery({
		queryKey: NOTIFICATIONS_QUERY_KEYS.unreadCount,
		queryFn: getUnreadNotificationCount,
	});
}
