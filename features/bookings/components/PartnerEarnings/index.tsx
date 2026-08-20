// features/bookings/components/PartnerEarnings/index.tsx
"use client";

import Link from "next/link";
import type { JSX } from "react";
import { PartnerEarningsMonthGroup } from "@/features/bookings/components/PartnerEarnings/PartnerEarningsMonthGroup";
import { useMyBookingsQuery } from "@/features/bookings/queries";
import {
	calculateEarningsBreakdown,
	groupCompletedBookingsByMonth,
	sumBookingAmountsKrw,
} from "@/features/bookings/utils";
import { useMyPartnerProfileQuery } from "@/features/partners/queries";
import { formatKrw } from "@/features/partners/utils";
import { usePaymentStatusesQuery } from "@/features/payments/queries";
import { PartnerPayoutAccountCard } from "@/features/payouts/components/PartnerPayoutAccountCard";

export function PartnerEarnings(): JSX.Element {
	const { data: myPartnerProfile, isPending: isProfilePending } = useMyPartnerProfileQuery();
	const { data: bookings, isPending: isBookingsPending, isError } = useMyBookingsQuery();

	const completed = (bookings ?? []).filter(function (booking) {
		return booking.isReceived && booking.status === "completed";
	});
	const { data: paymentStatuses } = usePaymentStatusesQuery(
		completed.map(function (booking) {
			return booking.id;
		}),
	);

	if (isProfilePending || isBookingsPending) {
		return (
			<div className="flex flex-col gap-3">
				<div className="bg-surface-alt h-20 animate-pulse rounded-2xl" />
				<div className="bg-surface-alt h-32 animate-pulse rounded-2xl" />
			</div>
		);
	}

	if (!myPartnerProfile) {
		return (
			<div className="flex flex-col items-center gap-4 py-24">
				<p className="text-sub text-sm">아직 파트너로 등록하지 않았어요.</p>
				<Link href="/partner/register" className="text-brand font-medium underline">
					파트너 등록하러 가기
				</Link>
			</div>
		);
	}

	if (isError) {
		return <p className="text-sub py-16 text-center text-sm">정산 내역을 불러오지 못했어요.</p>;
	}

	const totalKrw = sumBookingAmountsKrw(
		completed.map(function (booking) {
			return booking.total_amount_krw;
		}),
	);
	const { feeKrw, netKrw } = calculateEarningsBreakdown(totalKrw);
	const monthlyGroups = groupCompletedBookingsByMonth(completed);

	return (
		<div className="flex flex-col gap-5">
			<PartnerPayoutAccountCard />

			<div className="bg-secondary-50 flex flex-col gap-1 rounded-2xl px-4.5 py-4">
				<span className="text-secondary-700 text-sm font-semibold">전체 누적 정산 금액</span>
				<span className="text-secondary-700 text-2xl font-bold tabular-nums">
					{formatKrw(netKrw)}
				</span>
				<span className="text-secondary-700 text-xs">
					완료된 데이트 {completed.length}건 · 총액 {formatKrw(totalKrw)} · 수수료(5%){" "}
					{formatKrw(feeKrw)}
				</span>
			</div>

			{monthlyGroups.length === 0 ? (
				<p className="bg-surface-alt text-sub rounded-2xl px-4 py-8 text-center text-sm">
					아직 완료된 데이트가 없어요.
				</p>
			) : (
				monthlyGroups.map(function (group) {
					return (
						<PartnerEarningsMonthGroup
							key={group.monthKey}
							group={group}
							paymentStatuses={paymentStatuses ?? {}}
						/>
					);
				})
			)}
		</div>
	);
}
