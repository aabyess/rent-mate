// features/payments/utils.ts
import type { PaymentStatus } from "@/features/payments/types";

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
	pending: "결제 대기",
	paid: "결제 완료",
	refunded: "환불 완료",
	released: "정산 완료",
};

export const PAYMENT_STATUS_BADGE_VARIANTS: Record<PaymentStatus, "warning" | "trust" | "neutral"> =
	{
		pending: "warning",
		paid: "trust",
		refunded: "neutral",
		released: "neutral",
	};
