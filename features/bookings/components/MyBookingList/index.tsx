// features/bookings/components/MyBookingList/index.tsx
"use client";

import Link from "next/link";
import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { useMyBookingsQuery } from "@/features/bookings/queries";
import type { BookingStatus } from "@/features/bookings/types";
import { BOOKING_STATUS_LABELS, formatBookingPeriod } from "@/features/bookings/utils";
import { formatKrw } from "@/features/partners/utils";

const STATUS_BADGE_VARIANTS: Record<BookingStatus, "warning" | "trust" | "neutral" | "error"> = {
	requested: "warning",
	accepted: "trust",
	rejected: "error",
	canceled: "neutral",
	completed: "neutral",
};

export function MyBookingList(): JSX.Element {
	const { data: bookings, isPending, isError } = useMyBookingsQuery();

	if (isPending) {
		return (
			<div className="flex flex-col gap-3">
				{Array.from({ length: 3 }, function (_, index) {
					return <div key={index} className="bg-surface-alt h-28 animate-pulse rounded-2xl" />;
				})}
			</div>
		);
	}

	if (isError) {
		return <p className="text-sub py-16 text-center text-sm">예약 내역을 불러오지 못했어요.</p>;
	}

	if (bookings.length === 0) {
		return (
			<div className="flex flex-col items-center gap-3 py-16">
				<p className="text-sub text-sm">아직 예약이 없어요.</p>
				<Link href="/" className="text-brand text-sm font-medium underline">
					파트너 둘러보기
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{bookings.map(function (booking) {
				return (
					<article
						key={booking.id}
						className="bg-surface-alt flex flex-col gap-2.5 rounded-2xl p-4">
						<div className="flex items-center justify-between">
							<span className="text-base font-semibold">{booking.partnerNickname}</span>
							<Badge variant={STATUS_BADGE_VARIANTS[booking.status]}>
								{BOOKING_STATUS_LABELS[booking.status]}
							</Badge>
						</div>
						<div className="text-sub flex flex-col gap-1 text-sm">
							<span className="tabular-nums">
								{formatBookingPeriod(booking.starts_at, booking.ends_at)}
							</span>
							<span>{booking.place}</span>
						</div>
						<span className="text-[15px] font-bold tabular-nums">
							{formatKrw(booking.total_amount_krw)}
						</span>
					</article>
				);
			})}
		</div>
	);
}
