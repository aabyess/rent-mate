// features/bookings/components/BookingDetail/BookingDetailPayment.tsx
import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { formatKrw } from "@/features/partners/utils";
import type { PaymentRow, PaymentStatus } from "@/features/payments/types";

// 결제 상세 화면 전용 문구 — 카드 뱃지(features/payments/utils)와는 뉘앙스가 달라 별도 유지
const DETAIL_PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
	pending: "결제 대기",
	paid: "에스크로 보관 중",
	released: "정산 완료",
	refunded: "환불 완료",
};

const DETAIL_PAYMENT_STATUS_VARIANTS: Record<PaymentStatus, "warning" | "trust" | "neutral"> = {
	pending: "warning",
	paid: "trust",
	released: "neutral",
	refunded: "neutral",
};

type BookingDetailPaymentProps = {
	payment: PaymentRow | null;
	totalAmountKrw: number;
};

export function BookingDetailPayment({
	payment,
	totalAmountKrw,
}: BookingDetailPaymentProps): JSX.Element {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-[17px] font-semibold">결제</h2>
			<div className="bg-surface-alt flex flex-col gap-2 rounded-2xl px-4 py-4">
				<div className="flex items-center justify-between">
					<span className="text-base font-bold tabular-nums">{formatKrw(totalAmountKrw)}</span>
					{payment ? (
						<Badge variant={DETAIL_PAYMENT_STATUS_VARIANTS[payment.status]}>
							{DETAIL_PAYMENT_STATUS_LABELS[payment.status]}
						</Badge>
					) : (
						<Badge variant="warning">결제 대기</Badge>
					)}
				</div>
				{payment?.status === "paid" && (
					<p className="text-sub text-xs leading-relaxed">
						데이트 완료 후 파트너에게 정산돼요. 예약 취소 시 환불 처리됩니다.
					</p>
				)}
			</div>
		</section>
	);
}
