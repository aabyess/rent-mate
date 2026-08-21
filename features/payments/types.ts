// features/payments/types.ts

export type PaymentStatus = "pending" | "paid" | "refunded" | "released";

export type PaymentRow = {
	id: string;
	booking_id: string;
	customer_id: string;
	amount_krw: number;
	status: PaymentStatus;
	provider: string;
	provider_payment_key: string | null;
	approved_at: string | null;
	created_at: string;
	refunded_amount_krw: number | null;
	cancellation_fee_krw: number | null;
	payout_amount_krw: number | null;
	payout_fee_krw: number | null;
	released_at: string | null;
};

export type StartTossCheckoutInput = {
	bookingId: string;
	customerKey: string;
	amountKrw: number;
	orderName: string;
};

export type StartTokenCheckoutInput = {
	purchaseId: string;
	customerKey: string;
	amountKrw: number;
	orderName: string;
};
