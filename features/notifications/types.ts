// features/notifications/types.ts

export type NotificationType =
	| "booking_requested"
	| "booking_accepted"
	| "booking_rejected"
	| "booking_canceled"
	| "review_received"
	| "booking_reminder"
	| "partner_approved"
	| "partner_rejected";

export type BookingNotificationType = Exclude<
	NotificationType,
	"partner_approved" | "partner_rejected"
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
