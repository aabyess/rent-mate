// features/notifications/components/NotificationListItem.tsx
"use client";

import Link from "next/link";
import type { JSX } from "react";
import { useMarkNotificationReadMutation } from "@/features/notifications/mutations";
import type { NotificationRow } from "@/features/notifications/types";
import { NOTIFICATION_LABELS, formatNotificationDate } from "@/features/notifications/utils";
import { cn } from "@/utils/cn";

type NotificationListItemProps = {
	notification: NotificationRow;
};

export function NotificationListItem({ notification }: NotificationListItemProps): JSX.Element {
	const markReadMutation = useMarkNotificationReadMutation();
	const isUnread = notification.read_at === null;

	function handleClick(): void {
		if (isUnread) {
			markReadMutation.mutate(notification.id);
		}
	}

	return (
		<Link
			href={`/bookings/${notification.payload.bookingId}`}
			onClick={handleClick}
			className={cn(
				"flex items-center gap-3 rounded-2xl px-4 py-3.5",
				isUnread ? "bg-brand-subtle" : "bg-surface-alt",
			)}>
			<span
				className={cn(
					"mt-0.5 size-2 shrink-0 rounded-full",
					isUnread ? "bg-brand" : "bg-transparent",
				)}
			/>
			<div className="flex flex-col gap-0.5">
				<span className={cn("text-sm", isUnread ? "text-primary-700 font-semibold" : "text-body")}>
					{NOTIFICATION_LABELS[notification.type]}
				</span>
				<span className="text-sub text-xs tabular-nums">
					{formatNotificationDate(notification.created_at)}
				</span>
			</div>
		</Link>
	);
}
