// features/bookings/types.ts

export type BookingStatus = "requested" | "accepted" | "rejected" | "canceled" | "completed";

export type CreateBookingInput = {
	partnerId: string;
	startsAt: string;
	endsAt: string;
	place: string;
	totalAmountKrw: number;
};

export type BookingRow = {
	id: string;
	customer_id: string;
	partner_id: string;
	starts_at: string;
	ends_at: string;
	place: string;
	status: BookingStatus;
	total_amount_krw: number;
	created_at: string;
};

export type MyBookingItem = BookingRow & {
	isReceived: boolean;
	counterpartId: string;
	counterpartName: string;
};

export type BookingSchedule = {
	year: number;
	month: number;
	day: number;
	startHour: number;
	durationMinutes: number;
};

export type BookingTimeRange = {
	starts_at: string;
	ends_at: string;
};
