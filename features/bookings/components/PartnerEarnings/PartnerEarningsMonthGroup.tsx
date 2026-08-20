// features/bookings/components/PartnerEarnings/PartnerEarningsMonthGroup.tsx
import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { formatBookingPeriod, type MonthlyEarningsGroup } from "@/features/bookings/utils";
import { formatKrw } from "@/features/partners/utils";
import type { PaymentStatus } from "@/features/payments/types";

const ESCROW_LABELS: Record<PaymentStatus, string> = {
	pending: "결제 대기",
	paid: "에스크로 보관 · 정산 예정",
	refunded: "환불 완료",
	released: "정산 완료",
};

const ESCROW_BADGE_VARIANTS: Record<PaymentStatus, "warning" | "trust" | "neutral"> = {
	pending: "warning",
	paid: "trust",
	refunded: "neutral",
	released: "neutral",
};

type PartnerEarningsMonthGroupProps = {
	group: MonthlyEarningsGroup;
	paymentStatuses: Record<string, PaymentStatus>;
};

export function PartnerEarningsMonthGroup({
	group,
	paymentStatuses,
}: PartnerEarningsMonthGroupProps): JSX.Element {
	return (
		<section className="flex flex-col gap-2.5">
			<div className="flex items-center justify-between">
				<h2 className="text-[15px] font-semibold">{group.monthLabel}</h2>
				<span className="text-sub text-sm font-semibold tabular-nums">
					{formatKrw(group.subtotalKrw)}
				</span>
			</div>
			<div className="bg-surface divide-line flex flex-col divide-y rounded-2xl">
				{group.bookings.map(function (booking) {
					const paymentStatus = paymentStatuses[booking.id];
					return (
						<div key={booking.id} className="flex items-center justify-between gap-3 px-4.5 py-3.5">
							<div className="flex flex-col gap-0.5">
								<span className="text-[15px] font-medium">{booking.counterpartName} 님</span>
								<span className="text-sub text-xs tabular-nums">
									{formatBookingPeriod(booking.starts_at, booking.ends_at)}
								</span>
								<Badge
									variant={paymentStatus ? ESCROW_BADGE_VARIANTS[paymentStatus] : "neutral"}
									className="mt-1 w-fit">
									{paymentStatus ? ESCROW_LABELS[paymentStatus] : "결제 내역 없음"}
								</Badge>
							</div>
							<span className="text-[15px] font-bold tabular-nums">
								{formatKrw(booking.total_amount_krw)}
							</span>
						</div>
					);
				})}
			</div>
		</section>
	);
}
