// features/notifications/components/NotificationList.tsx
"use client";

import Link from "next/link";
import type { JSX } from "react";
import { useMarkNotificationReadMutation } from "@/features/notifications/mutations";
import { useMyNotificationsQuery } from "@/features/notifications/queries";
import type { NotificationRow } from "@/features/notifications/types";
import { NOTIFICATION_LABELS, formatNotificationDate } from "@/features/notifications/utils";
import { cn } from "@/utils/cn";

function NotificationListItem({ notification }: { notification: NotificationRow }): JSX.Element {
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

export function NotificationList(): JSX.Element {
	const { data: notifications, isPending, isError } = useMyNotificationsQuery();

	if (isPending) {
		return (
			<div className="flex flex-col gap-2.5">
				{Array.from({ length: 4 }, function (_, index) {
					return <div key={index} className="bg-surface-alt h-16 animate-pulse rounded-2xl" />;
				})}
			</div>
		);
	}

	if (isError) {
		return <p className="text-sub py-16 text-center text-sm">알림을 불러오지 못했어요.</p>;
	}

	if (notifications.length === 0) {
		return <p className="text-sub py-16 text-center text-sm">아직 알림이 없어요.</p>;
	}

	return (
		<div className="flex flex-col gap-2.5">
			{notifications.map(function (notification) {
				return <NotificationListItem key={notification.id} notification={notification} />;
			})}
		</div>
	);
}
