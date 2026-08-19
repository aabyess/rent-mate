// features/payments/apis.ts
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import type { PaymentStatus, StartTossCheckoutInput } from "@/features/payments/types";
import { createClient } from "@/libs/supabase/client";

export function getTossClientKey(): string | null {
	return process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? null;
}

// 토스 결제창 호출 — 성공/실패 시 successUrl/failUrl로 리다이렉트된다
export async function startTossCheckout({
	bookingId,
	customerKey,
	amountKrw,
	orderName,
}: StartTossCheckoutInput): Promise<void> {
	const clientKey = getTossClientKey();
	if (!clientKey) {
		throw new Error("결제 설정이 없어 결제를 진행할 수 없습니다.");
	}

	const tossPayments = await loadTossPayments(clientKey);
	const payment = tossPayments.payment({ customerKey });
	await payment.requestPayment({
		method: "CARD",
		amount: { currency: "KRW", value: amountKrw },
		orderId: bookingId,
		orderName,
		successUrl: `${window.location.origin}/payments/success`,
		failUrl: `${window.location.origin}/payments/fail`,
	});
}

export async function getPaymentStatusesByBookingIds(
	bookingIds: string[],
): Promise<Record<string, PaymentStatus>> {
	if (bookingIds.length === 0) {
		return {};
	}
	const supabase = createClient();
	const { data, error } = await supabase
		.from("payments")
		.select("booking_id, status")
		.in("booking_id", Array.from(new Set(bookingIds)));
	if (error) {
		throw error;
	}

	const statusByBookingId: Record<string, PaymentStatus> = {};
	for (const row of (data ?? []) as { booking_id: string; status: PaymentStatus }[]) {
		statusByBookingId[row.booking_id] = row.status;
	}
	return statusByBookingId;
}
