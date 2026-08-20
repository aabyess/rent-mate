// features/notifications/utils.ts
import type { NotificationType } from "@/features/notifications/types";

export const NOTIFICATION_LABELS: Record<NotificationType, string> = {
	booking_requested: "새 예약 요청이 도착했어요",
	booking_accepted: "예약이 확정됐어요",
	booking_rejected: "예약이 거절됐어요",
	booking_canceled: "예약이 취소됐어요",
	review_received: "새 후기가 도착했어요",
};

export function formatNotificationDate(createdAt: string): string {
	const date = new Date(createdAt);
	const pad = function (value: number): string {
		return String(value).padStart(2, "0");
	};
	return `${date.getMonth() + 1}월 ${date.getDate()}일 ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
