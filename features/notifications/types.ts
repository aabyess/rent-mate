// features/notifications/types.ts

export type NotificationType =
	| "booking_requested"
	| "booking_accepted"
	| "booking_rejected"
	| "booking_canceled"
	| "review_received";

export type NotificationRow = {
	id: string;
	recipient_id: string;
	type: NotificationType;
	payload: { bookingId: string };
	read_at: string | null;
	created_at: string;
};

export type NotifyEventInput = {
	type: NotificationType;
	bookingId: string;
};
