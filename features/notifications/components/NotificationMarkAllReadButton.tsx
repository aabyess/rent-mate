// features/notifications/components/NotificationMarkAllReadButton.tsx
"use client";

import type { JSX } from "react";
import { useMarkAllNotificationsReadMutation } from "@/features/notifications/mutations";
import { useUnreadNotificationCountQuery } from "@/features/notifications/queries";

// 미읽음이 있을 때만 노출 — 0건이면 아무것도 렌더하지 않는다
export function NotificationMarkAllReadButton(): JSX.Element {
	const { data: unreadCount } = useUnreadNotificationCountQuery();
	const markAllReadMutation = useMarkAllNotificationsReadMutation();

	if (!unreadCount || unreadCount === 0) {
		return <></>;
	}

	function handleClick(): void {
		markAllReadMutation.mutate();
	}

	return (
		<button
			type="button"
			onClick={handleClick}
			disabled={markAllReadMutation.isPending}
			className="text-brand ml-auto shrink-0 text-[13px] font-medium disabled:opacity-50">
			{markAllReadMutation.isPending ? "처리 중..." : "모두 읽음"}
		</button>
	);
}
