// features/notifications/utils.ts
import type { NotificationRow, NotificationType } from "@/features/notifications/types";

export const NOTIFICATION_LABELS: Record<NotificationType, string> = {
	booking_requested: "새 예약 요청이 도착했어요",
	booking_accepted: "예약이 확정됐어요",
	booking_rejected: "예약이 거절됐어요",
	booking_canceled: "예약이 취소됐어요",
	review_received: "새 후기가 도착했어요",
	booking_reminder: "다가오는 데이트가 있어요",
	partner_approved: "파트너 승인이 완료됐어요 — 활동을 시작해보세요!",
	partner_rejected: "파트너 승인이 거절됐어요. 프로필을 보완해 다시 신청할 수 있어요.",
	payout_released: "정산이 완료됐어요",
};

export function getNotificationHref(notification: NotificationRow): string {
	if (notification.type === "partner_approved") {
		return "/";
	}
	if (notification.type === "partner_rejected") {
		return "/partner/register";
	}
	if (notification.type === "payout_released") {
		return "/partner/earnings";
	}
	return `/bookings/${notification.payload.bookingId}`;
}

export function formatNotificationDate(createdAt: string): string {
	const date = new Date(createdAt);
	const pad = function (value: number): string {
		return String(value).padStart(2, "0");
	};
	return `${date.getMonth() + 1}월 ${date.getDate()}일 ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
