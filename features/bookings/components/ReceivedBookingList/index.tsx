// features/bookings/components/ReceivedBookingList/index.tsx
"use client";

import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useUpdateBookingStatusMutation } from "@/features/bookings/mutations";
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

export function ReceivedBookingList(): JSX.Element {
	const { data: bookings, isPending, isError } = useMyBookingsQuery();
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

	function handleStatusUpdate(bookingId: string, status: BookingStatus): void {
		updateStatusMutation.mutate({ bookingId, status });
	}

	return (
		<div className="flex flex-col gap-3">
			{received.map(function (booking) {
				return (
					<article
						key={booking.id}
						className="bg-surface-alt flex flex-col gap-2.5 rounded-2xl p-4">
						<div className="flex items-center justify-between">
							<span className="text-base font-semibold">{booking.counterpartName} 님의 요청</span>
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
							<Button
								variant="outline"
								size="sm"
								fullWidth
								disabled={updateStatusMutation.isPending}
								onClick={function () {
									handleStatusUpdate(booking.id, "completed");
								}}>
								데이트 완료 처리
							</Button>
						)}
					</article>
				);
			})}
		</div>
	);
}
