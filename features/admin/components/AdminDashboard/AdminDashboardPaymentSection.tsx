// features/admin/components/AdminDashboard/AdminDashboardPaymentSection.tsx
"use client";

import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
	useCompletePartnerSettlementMutation,
	useUpdatePaymentStatusMutation,
} from "@/features/admin/mutations";
import { usePaymentsOverviewQuery } from "@/features/admin/queries";
import { BOOKING_STATUS_LABELS } from "@/features/bookings/utils";
import { formatKrw } from "@/features/partners/utils";
import type { PaymentStatus } from "@/features/payments/types";

// 관리자용 상태 라벨 — 고객·파트너에게 보이는 features/payments/utils의 라벨과는 문맥이 달라 별도 유지
const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
	pending: "대기",
	paid: "에스크로 보관",
	refunded: "환불 완료",
	released: "정산 완료",
};

const PAYMENT_STATUS_BADGE_VARIANTS: Record<PaymentStatus, "warning" | "trust" | "neutral"> = {
	pending: "warning",
	paid: "trust",
	refunded: "neutral",
	released: "neutral",
};

export function AdminDashboardPaymentSection(): JSX.Element {
	const { data: payments, isPending, isError } = usePaymentsOverviewQuery();
	const updatePaymentStatusMutation = useUpdatePaymentStatusMutation();
	const completeSettlementMutation = useCompletePartnerSettlementMutation();

	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-[17px] font-semibold">결제 관리</h2>
			{isPending && <div className="bg-surface-alt h-24 animate-pulse rounded-2xl" />}
			{isError && <p className="text-sub py-6 text-center text-sm">목록을 불러오지 못했어요.</p>}
			{payments && payments.length === 0 && (
				<p className="bg-surface-alt text-sub rounded-2xl px-4 py-6 text-center text-sm">
					결제 내역이 없어요.
				</p>
			)}
			{payments &&
				payments.map(function (payment) {
					return (
						<article
							key={payment.id}
							className="bg-surface-alt flex flex-col gap-2.5 rounded-2xl p-4">
							<div className="flex items-center justify-between">
								<span className="text-sm font-semibold">{payment.customerName}</span>
								<div className="flex items-center gap-1.5">
									{payment.needsRefund && <Badge variant="error">환불 필요</Badge>}
									<Badge variant={PAYMENT_STATUS_BADGE_VARIANTS[payment.status]}>
										{PAYMENT_STATUS_LABELS[payment.status]}
									</Badge>
								</div>
							</div>
							<div className="text-sub flex items-center justify-between text-sm">
								<span>예약 상태: {BOOKING_STATUS_LABELS[payment.bookingStatus]}</span>
								<span className="text-body font-bold tabular-nums">
									{formatKrw(payment.amount_krw)}
								</span>
							</div>
							{payment.status === "released" &&
								payment.payout_amount_krw !== null &&
								payment.payout_fee_krw !== null && (
									<p className="text-sub text-xs tabular-nums">
										정산액 {formatKrw(payment.payout_amount_krw)} · 수수료(5%){" "}
										{formatKrw(payment.payout_fee_krw)}
									</p>
								)}
							{payment.needsRefund && (
								<Button
									size="sm"
									fullWidth
									isLoading={updatePaymentStatusMutation.isPending}
									onClick={function () {
										updatePaymentStatusMutation.mutate({
											paymentId: payment.id,
											status: "refunded",
										});
									}}
									className="bg-error-500 hover:bg-error-700 active:bg-error-700">
									환불 처리
								</Button>
							)}
							{payment.canRelease && (
								<Button
									variant="secondary"
									size="sm"
									fullWidth
									isLoading={completeSettlementMutation.isPending}
									onClick={function () {
										completeSettlementMutation.mutate(payment.id);
									}}>
									정산 완료
								</Button>
							)}
							{updatePaymentStatusMutation.isError && (
								<p className="text-error-500 text-sm">
									{updatePaymentStatusMutation.error.message}
								</p>
							)}
							{completeSettlementMutation.isError && (
								<p className="text-error-500 text-sm">{completeSettlementMutation.error.message}</p>
							)}
						</article>
					);
				})}
		</section>
	);
}
