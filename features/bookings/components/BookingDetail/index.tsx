// features/bookings/components/BookingDetail/index.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { BookingDetailCounterpart } from "@/features/bookings/components/BookingDetail/BookingDetailCounterpart";
import { BookingDetailPayment } from "@/features/bookings/components/BookingDetail/BookingDetailPayment";
import { BookingDetailReview } from "@/features/bookings/components/BookingDetail/BookingDetailReview";
import { BookingDetailShareButton } from "@/features/bookings/components/BookingDetail/BookingDetailShareButton";
import { BookingDetailStatusSteps } from "@/features/bookings/components/BookingDetail/BookingDetailStatusSteps";
import { MyBookingListCancelDialog } from "@/features/bookings/components/MyBookingList/MyBookingListCancelDialog";
import { useUpdateBookingStatusMutation } from "@/features/bookings/mutations";
import { useBookingDetailQuery } from "@/features/bookings/queries";
import {
	canCompleteBookingNow,
	formatBookingPeriod,
	formatDurationLabel,
	getBookingAcceptErrorMessage,
} from "@/features/bookings/utils";
import { usePartnerDetailQuery } from "@/features/partners/queries";
import { usePaymentByBookingIdQuery } from "@/features/payments/queries";
import { ReviewDialog } from "@/features/reviews/components/ReviewDialog";
import {
	useMyReviewedBookingIdsQuery,
	useReviewByBookingIdQuery,
} from "@/features/reviews/queries";
import { getKakaoMapSearchUrl } from "@/utils/kakaoMapLink";

const NOW_MS = Date.now();

type BookingDetailProps = {
	bookingId: string;
};

export function BookingDetail({ bookingId }: BookingDetailProps): JSX.Element {
	const router = useRouter();
	const { data: booking, isPending, isError } = useBookingDetailQuery(bookingId);
	const { data: payment } = usePaymentByBookingIdQuery(bookingId);
	const { data: reviewedBookingIds } = useMyReviewedBookingIdsQuery();
	const { data: review } = useReviewByBookingIdQuery(bookingId);
	const { data: partnerProfile } = usePartnerDetailQuery(booking?.counterpartId ?? "");
	const updateStatusMutation = useUpdateBookingStatusMutation();

	const [isCancelOpen, setIsCancelOpen] = useState(false);
	const [isReviewOpen, setIsReviewOpen] = useState(false);

	function handleBack(): void {
		router.back();
	}

	if (isPending) {
		return (
			<div className="flex flex-col gap-4 px-5 py-5">
				<div className="bg-surface-alt h-24 animate-pulse rounded-2xl" />
				<div className="bg-surface-alt h-16 animate-pulse rounded-2xl" />
				<div className="bg-surface-alt h-32 animate-pulse rounded-2xl" />
			</div>
		);
	}

	if (isError || !booking) {
		return (
			<div className="flex flex-col items-center gap-4 py-24">
				<p className="text-sub text-sm">예약을 찾을 수 없어요.</p>
				<Link href="/bookings" className="text-brand font-medium underline">
					예약 목록으로
				</Link>
			</div>
		);
	}

	const durationMinutes = Math.round(
		(new Date(booking.ends_at).getTime() - new Date(booking.starts_at).getTime()) / 60000,
	);
	const isCancelable =
		!booking.isReceived &&
		(booking.status === "requested" || booking.status === "accepted") &&
		new Date(booking.starts_at).getTime() > NOW_MS;
	const isReviewable =
		!booking.isReceived &&
		booking.status === "completed" &&
		!(reviewedBookingIds ?? []).includes(booking.id);
	const isCompletableNow = booking.isReceived && canCompleteBookingNow(booking);
	const currentBookingId = booking.id;

	function handleStatusUpdate(status: "accepted" | "rejected" | "completed"): void {
		updateStatusMutation.mutate({ bookingId: currentBookingId, status });
	}

	return (
		<div className="flex flex-col gap-6 px-5 py-4 pb-16">
			<div className="flex items-center gap-3">
				<button type="button" onClick={handleBack} aria-label="뒤로 가기">
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M15 5l-7 7 7 7" />
					</svg>
				</button>
				<h1 className="text-lg font-bold">예약 상세</h1>
			</div>

			<BookingDetailCounterpart
				name={booking.counterpartName}
				partnerProfile={!booking.isReceived ? (partnerProfile ?? null) : null}
			/>

			<BookingDetailStatusSteps status={booking.status} />

			<section className="flex flex-col gap-3">
				<h2 className="text-[17px] font-semibold">일시·장소</h2>
				<dl className="bg-surface-alt flex flex-col gap-2 rounded-2xl px-4 py-4 text-sm">
					<div className="flex items-center justify-between">
						<dt className="text-sub">일시</dt>
						<dd className="font-medium tabular-nums">
							{formatBookingPeriod(booking.starts_at, booking.ends_at)}
						</dd>
					</div>
					<div className="flex items-center justify-between">
						<dt className="text-sub">이용 시간</dt>
						<dd className="font-medium">{formatDurationLabel(durationMinutes)}</dd>
					</div>
					<div className="flex items-center justify-between">
						<dt className="text-sub">장소</dt>
						<dd className="font-medium">
							<a
								href={getKakaoMapSearchUrl(booking.place)}
								target="_blank"
								rel="noopener noreferrer"
								className="text-brand underline underline-offset-2">
								{booking.place}
							</a>
						</dd>
					</div>
				</dl>
			</section>

			<BookingDetailPayment payment={payment ?? null} totalAmountKrw={booking.total_amount_krw} />

			{booking.status === "completed" && review && <BookingDetailReview review={review} />}

			<div className="flex flex-col gap-2">
				{booking.status !== "canceled" && booking.status !== "rejected" && (
					<Link href={`/chats/${booking.id}`}>
						<Button variant="outline" fullWidth>
							채팅 열기
						</Button>
					</Link>
				)}

				{(booking.status === "accepted" || booking.status === "completed") && (
					<BookingDetailShareButton bookingId={booking.id} />
				)}

				{booking.isReceived && booking.status === "requested" && (
					<div className="flex gap-2">
						<Button
							variant="outline"
							fullWidth
							isLoading={updateStatusMutation.isPending}
							onClick={function () {
								handleStatusUpdate("rejected");
							}}>
							거절
						</Button>
						<Button
							variant="secondary"
							fullWidth
							isLoading={updateStatusMutation.isPending}
							onClick={function () {
								handleStatusUpdate("accepted");
							}}>
							수락
						</Button>
					</div>
				)}
				{booking.isReceived && booking.status === "accepted" && (
					<div className="flex flex-col gap-1.5">
						<Button
							variant="outline"
							fullWidth
							disabled={!isCompletableNow}
							isLoading={updateStatusMutation.isPending}
							onClick={function () {
								handleStatusUpdate("completed");
							}}>
							데이트 완료 처리
						</Button>
						{!isCompletableNow && (
							<p className="text-sub text-center text-xs">
								예약 시작 시각 이후에 완료 처리할 수 있어요.
							</p>
						)}
					</div>
				)}

				{isCancelable && (
					<button
						type="button"
						onClick={function () {
							setIsCancelOpen(true);
						}}
						className="text-sub py-1 text-center text-sm underline">
						예약 취소
					</button>
				)}
				{isReviewable && (
					<button
						type="button"
						onClick={function () {
							setIsReviewOpen(true);
						}}
						className="text-brand py-1 text-center text-sm font-medium underline">
						후기 작성
					</button>
				)}
				{updateStatusMutation.isError && (
					<p className="text-error-500 text-center text-sm">
						{getBookingAcceptErrorMessage(updateStatusMutation.error)}
					</p>
				)}
			</div>

			{isCancelOpen && (
				<MyBookingListCancelDialog
					booking={booking}
					onClose={function () {
						setIsCancelOpen(false);
					}}
				/>
			)}
			{isReviewOpen && (
				<ReviewDialog
					bookingId={booking.id}
					partnerId={booking.partner_id}
					partnerName={booking.counterpartName}
					onClose={function () {
						setIsReviewOpen(false);
					}}
				/>
			)}
		</div>
	);
}
