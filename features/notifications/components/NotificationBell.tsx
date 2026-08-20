// features/notifications/components/NotificationBell.tsx
"use client";

import Link from "next/link";
import type { JSX } from "react";
import { useUnreadNotificationCountQuery } from "@/features/notifications/queries";

export function NotificationBell(): JSX.Element {
	const { data: unreadCount } = useUnreadNotificationCountQuery();
	const hasUnread = !!unreadCount && unreadCount > 0;

	return (
		<Link
			href="/notifications"
			aria-label={hasUnread ? `알림 (읽지 않음 ${unreadCount}개)` : "알림"}
			className="relative flex size-9 shrink-0 items-center justify-center">
			<svg
				className="text-body"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round">
				<path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" />
				<path d="M9.5 17a2.5 2.5 0 0 0 5 0" />
			</svg>
			{hasUnread && (
				<span className="bg-error-500 absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white">
					{unreadCount > 9 ? "9+" : unreadCount}
				</span>
			)}
		</Link>
	);
}
