// features/bookings/components/MyBookingList/index.tsx
"use client";

import Link from "next/link";
import { useState, type JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { MyBookingListCancelDialog } from "@/features/bookings/components/MyBookingList/MyBookingListCancelDialog";
import { useMyBookingsQuery } from "@/features/bookings/queries";
import type { BookingStatus, MyBookingItem } from "@/features/bookings/types";
import { BOOKING_STATUS_LABELS, formatBookingPeriod } from "@/features/bookings/utils";
import { formatKrw } from "@/features/partners/utils";
import { ReviewDialog } from "@/features/reviews/components/ReviewDialog";
import { useMyReviewedBookingIdsQuery } from "@/features/reviews/queries";

const NOW_MS = Date.now();

const STATUS_BADGE_VARIANTS: Record<BookingStatus, "warning" | "trust" | "neutral" | "error"> = {
	requested: "warning",
	accepted: "trust",
	rejected: "error",
	canceled: "neutral",
	completed: "neutral",
};

function isCancelable(booking: MyBookingItem): boolean {
	return (
		(booking.status === "requested" || booking.status === "accepted") &&
		new Date(booking.starts_at).getTime() > NOW_MS
	);
}

export function MyBookingList(): JSX.Element {
	const { data: bookings, isPending, isError } = useMyBookingsQuery();
	const { data: reviewedBookingIds } = useMyReviewedBookingIdsQuery();
	const [cancelTarget, setCancelTarget] = useState<MyBookingItem | null>(null);
	const [reviewTarget, setReviewTarget] = useState<MyBookingItem | null>(null);

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

	const myBookings = bookings.filter(function (booking) {
		return !booking.isReceived;
	});

	if (myBookings.length === 0) {
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
			{myBookings.map(function (booking) {
				return (
					<article
						key={booking.id}
						className="bg-surface-alt flex flex-col gap-2.5 rounded-2xl p-4">
						<div className="flex items-center justify-between">
							<span className="text-base font-semibold">{booking.counterpartName}</span>
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
						<div className="flex items-center justify-between">
							<span className="text-[15px] font-bold tabular-nums">
								{formatKrw(booking.total_amount_krw)}
							</span>
							{isCancelable(booking) && (
								<button
									type="button"
									onClick={function () {
										setCancelTarget(booking);
									}}
									className="text-sub text-[13px] underline">
									예약 취소
								</button>
							)}
							{booking.status === "completed" &&
								!(reviewedBookingIds ?? []).includes(booking.id) && (
									<button
										type="button"
										onClick={function () {
											setReviewTarget(booking);
										}}
										className="text-brand text-[13px] font-medium underline">
										후기 작성
									</button>
								)}
						</div>
					</article>
				);
			})}
			{cancelTarget && (
				<MyBookingListCancelDialog
					booking={cancelTarget}
					onClose={function () {
						setCancelTarget(null);
					}}
				/>
			)}
			{reviewTarget && (
				<ReviewDialog
					bookingId={reviewTarget.id}
					partnerId={reviewTarget.partner_id}
					partnerName={reviewTarget.counterpartName}
					onClose={function () {
						setReviewTarget(null);
					}}
				/>
			)}
		</div>
	);
}
