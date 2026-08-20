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
	| "payout_released";

// 클라이언트(postNotifyEvent)가 직접 보낼 수 있는 예약류 타입. booking_reminder는
// cron 라우트가 admin 클라이언트로 직접 insert하므로 여기서 제외한다.
export type BookingNotificationType = Exclude<
	NotificationType,
	"partner_approved" | "partner_rejected" | "payout_released" | "booking_reminder"
>;

export type NotificationPayload = {
	bookingId?: string;
	partnerId?: string;
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
	| { type: "partner_approved" | "partner_rejected"; partnerId: string };
