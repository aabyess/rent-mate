// features/bookings/components/ReceivedBookingList/index.tsx
"use client";

import Link from "next/link";
import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useUpdateBookingStatusMutation } from "@/features/bookings/mutations";
import { useMyBookingsQuery } from "@/features/bookings/queries";
import type { BookingStatus, MyBookingItem } from "@/features/bookings/types";
import {
	BOOKING_STATUS_LABELS,
	formatBookingPeriod,
	sumBookingAmountsKrw,
} from "@/features/bookings/utils";
import { formatKrw } from "@/features/partners/utils";
import { usePaymentStatusesQuery } from "@/features/payments/queries";
import { PAYMENT_STATUS_BADGE_VARIANTS, PAYMENT_STATUS_LABELS } from "@/features/payments/utils";

const STATUS_BADGE_VARIANTS: Record<BookingStatus, "warning" | "trust" | "neutral" | "error"> = {
	requested: "warning",
	accepted: "trust",
	rejected: "error",
	canceled: "neutral",
	completed: "neutral",
};

function canCompleteNow(booking: MyBookingItem): boolean {
	return booking.status === "accepted" && Date.now() >= new Date(booking.starts_at).getTime();
}

export function ReceivedBookingList(): JSX.Element {
	const { data: bookings, isPending, isError } = useMyBookingsQuery();
	const { data: paymentStatuses } = usePaymentStatusesQuery(
		(bookings ?? []).map(function (booking) {
			return booking.id;
		}),
	);
	const updateStatusMutation = useUpdateBookingStatusMutation();

	if (isPending) {
		return (
			<div className="flex flex-col gap-3">
				{Array.from({ length: 2 }, function (_, index) {
					return <div key={index} className="bg-surface-alt h-32 animate-pulse rounded-2xl" />;
				})}
			</div>
		);
	}

	if (isError) {
		return <p className="text-sub py-16 text-center text-sm">받은 요청을 불러오지 못했어요.</p>;
	}

	const received = bookings.filter(function (booking) {
		return booking.isReceived;
	});

	if (received.length === 0) {
		return <p className="text-sub py-16 text-center text-sm">아직 받은 예약 요청이 없어요.</p>;
	}

	const completed = received.filter(function (booking) {
		return booking.status === "completed";
	});
	const totalEarningsKrw = sumBookingAmountsKrw(
		completed.map(function (booking) {
			return booking.total_amount_krw;
		}),
	);

	function handleStatusUpdate(bookingId: string, status: BookingStatus): void {
		updateStatusMutation.mutate({ bookingId, status });
	}

	return (
		<div className="flex flex-col gap-3">
			{completed.length > 0 && (
				<div className="bg-secondary-50 flex items-center justify-between rounded-2xl px-4.5 py-4">
					<span className="text-secondary-700 text-sm font-semibold">
						완료된 데이트 {completed.length}건
					</span>
					<span className="text-secondary-700 text-base font-bold tabular-nums">
						정산 예정 {formatKrw(totalEarningsKrw)}
					</span>
				</div>
			)}
			{received.map(function (booking) {
				const paymentStatus = paymentStatuses?.[booking.id];
				const isCompletable = canCompleteNow(booking);
				return (
					<article
						key={booking.id}
						className="bg-surface-alt flex flex-col gap-2.5 rounded-2xl p-4">
						<div className="flex items-center justify-between">
							<span className="text-base font-semibold">{booking.counterpartName} 님의 요청</span>
							<div className="flex items-center gap-1.5">
								{paymentStatus && (
									<Badge variant={PAYMENT_STATUS_BADGE_VARIANTS[paymentStatus]}>
										{PAYMENT_STATUS_LABELS[paymentStatus]}
									</Badge>
								)}
								<Badge variant={STATUS_BADGE_VARIANTS[booking.status]}>
									{BOOKING_STATUS_LABELS[booking.status]}
								</Badge>
							</div>
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
							{booking.status !== "canceled" && booking.status !== "rejected" && (
								<Link
									href={`/chats/${booking.id}`}
									className="text-trust text-[13px] font-medium underline">
									채팅
								</Link>
							)}
						</div>
						{booking.status === "requested" && (
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									fullWidth
									disabled={updateStatusMutation.isPending}
									onClick={function () {
										handleStatusUpdate(booking.id, "rejected");
									}}>
									거절
								</Button>
								<Button
									variant="secondary"
									size="sm"
									fullWidth
									disabled={updateStatusMutation.isPending}
									onClick={function () {
										handleStatusUpdate(booking.id, "accepted");
									}}>
									수락
								</Button>
							</div>
						)}
						{booking.status === "accepted" && (
							<div className="flex flex-col gap-1.5">
								<Button
									variant="outline"
									size="sm"
									fullWidth
									disabled={updateStatusMutation.isPending || !isCompletable}
									onClick={function () {
										handleStatusUpdate(booking.id, "completed");
									}}>
									데이트 완료 처리
								</Button>
								{!isCompletable && (
									<p className="text-sub text-center text-xs">
										예약 시작 시각 이후에 완료 처리할 수 있어요.
									</p>
								)}
							</div>
						)}
					</article>
				);
			})}
		</div>
	);
}
