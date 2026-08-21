// features/notifications/types.ts

export type NotificationType =
	| "booking_requested"
	| "booking_accepted"
	| "booking_rejected"
	| "booking_canceled"
	| "review_received"
	| "booking_reminder"
	| "partner_approved"
	| "partner_rejected"
	| "payout_released"
	| "report_resolved";

// 클라이언트(postNotifyEvent)가 직접 보낼 수 있는 예약류 타입. booking_reminder는
// 원래 크론(하루 1회) 전용이었으나, 수락~시작이 24시간 미만인 예약은 크론이 그
// 타이밍을 놓쳐 리마인더를 영영 못 받는 구멍이 있어 클라에서도 조건부로 보낸다 —
// 서버가 caller 당사자 여부·status=accepted·24시간 이내를 다시 검증한다.
export type BookingNotificationType = Exclude<
	NotificationType,
	"partner_approved" | "partner_rejected" | "payout_released" | "report_resolved"
>;

export type NotificationPayload = {
	bookingId?: string;
	partnerId?: string;
	reportId?: string;
};

export type NotificationRow = {
	id: string;
	recipient_id: string;
	type: NotificationType;
	payload: NotificationPayload;
	read_at: string | null;
	created_at: string;
};

export type NotifyEventInput =
	| { type: BookingNotificationType; bookingId: string }
	| { type: "partner_approved" | "partner_rejected"; partnerId: string }
	| { type: "report_resolved"; reportId: string };
