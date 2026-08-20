// features/notifications/components/NotificationList.tsx
"use client";

import type { JSX } from "react";
import { NotificationListItem } from "@/features/notifications/components/NotificationListItem";
import { useMyNotificationsQuery } from "@/features/notifications/queries";

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
