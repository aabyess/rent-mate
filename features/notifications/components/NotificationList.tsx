// features/notifications/components/NotificationList.tsx
"use client";

import type { JSX } from "react";
import { NotificationListItem } from "@/features/notifications/components/NotificationListItem";
import { useMyNotificationsQuery } from "@/features/notifications/queries";

// 렌더 중 new Date() 직접 호출 금지(purity 규칙) — 모듈 로드 시점 스냅샷으로 충분
const TODAY = new Date();

function isToday(createdAt: string): boolean {
	const date = new Date(createdAt);
	return (
		date.getFullYear() === TODAY.getFullYear() &&
		date.getMonth() === TODAY.getMonth() &&
		date.getDate() === TODAY.getDate()
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

	const todayNotifications = notifications.filter(function (notification) {
		return isToday(notification.created_at);
	});
	const earlierNotifications = notifications.filter(function (notification) {
		return !isToday(notification.created_at);
	});
	const hasBothGroups = todayNotifications.length > 0 && earlierNotifications.length > 0;

	return (
		<div className="flex flex-col gap-2.5">
			{hasBothGroups && <span className="text-sub text-xs font-medium">오늘</span>}
			{todayNotifications.map(function (notification) {
				return <NotificationListItem key={notification.id} notification={notification} />;
			})}
			{hasBothGroups && <span className="text-sub mt-1 text-xs font-medium">이전</span>}
			{earlierNotifications.map(function (notification) {
				return <NotificationListItem key={notification.id} notification={notification} />;
			})}
		</div>
	);
}
