// features/partners/components/PartnerHome/index.tsx
"use client";

import Link from "next/link";
import { useState, type JSX } from "react";
import { useMyBookingsQuery } from "@/features/bookings/queries";
import { formatBookingPeriod, sumBookingAmountsKrw } from "@/features/bookings/utils";
import { usePartnerLikeCountQuery } from "@/features/favorites/queries";
import { formatKrw } from "@/features/partners/utils";
import type { MyPartnerProfile } from "@/features/partners/types";

type PartnerHomeProps = {
	partnerProfile: MyPartnerProfile;
};

// 파트너의 홈 — 탐색 덱 대신 영업 현황(요청·일정·정산)과 일기 작성이 뜬다
export function PartnerHome({ partnerProfile }: PartnerHomeProps): JSX.Element {
	const { data: bookings, isPending } = useMyBookingsQuery();
	const { data: likeCount } = usePartnerLikeCountQuery(partnerProfile.profile_id);
	// 렌더 중 Date.now() 직접 호출 금지(purity 규칙) — 마운트 시점 스냅샷으로 충분
	const [nowMs] = useState(function () {
		return Date.now();
	});

	const received = (bookings ?? []).filter(function (booking) {
		return booking.isReceived;
	});
	const requestedCount = received.filter(function (booking) {
		return booking.status === "requested";
	}).length;
	const upcoming = received
		.filter(function (booking) {
			return booking.status === "accepted" && new Date(booking.starts_at).getTime() > nowMs;
		})
		.sort(function (a, b) {
			return new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime();
		})
		.slice(0, 2);
	const completedTotalKrw = sumBookingAmountsKrw(
		received
			.filter(function (booking) {
				return booking.status === "completed";
			})
			.map(function (booking) {
				return booking.total_amount_krw;
			}),
	);

	if (isPending) {
		return (
			<div className="flex flex-col gap-3 px-5 py-4">
				<div className="bg-surface-alt h-20 animate-pulse rounded-2xl" />
				<div className="bg-surface-alt h-32 animate-pulse rounded-2xl" />
				<div className="bg-surface-alt h-40 animate-pulse rounded-2xl" />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3.5 px-5 py-4">
			{requestedCount > 0 && (
				<Link
					href="/bookings"
					className="bg-brand-subtle flex items-center justify-between rounded-2xl px-4.5 py-4">
					<span className="text-primary-700 text-[15px] font-semibold">
						새 예약 요청 {requestedCount}건이 기다리고 있어요
					</span>
					<svg
						className="text-primary-700"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M9 5l7 7-7 7" />
					</svg>
				</Link>
			)}

			<section className="bg-surface flex flex-col gap-2.5 rounded-2xl p-4.5">
				<h2 className="text-[15px] font-semibold">다가오는 데이트</h2>
				{upcoming.length === 0 ? (
					<p className="text-sub text-sm">확정된 데이트가 아직 없어요.</p>
				) : (
					upcoming.map(function (booking) {
						return (
							<Link
								key={booking.id}
								href={`/bookings/${booking.id}`}
								className="bg-surface-alt flex flex-col gap-0.5 rounded-xl px-3.5 py-3">
								<span className="text-[15px] font-medium">{booking.counterpartName} 님</span>
								<span className="text-sub text-xs tabular-nums">
									{formatBookingPeriod(booking.starts_at, booking.ends_at)} · {booking.place}
								</span>
							</Link>
						);
					})
				)}
			</section>

			<Link
				href="/partner/likers"
				className="bg-brand-subtle flex items-center justify-between rounded-2xl px-4.5 py-4">
				<span className="text-primary-700 text-sm font-semibold">받은 좋아요</span>
				<span className="text-primary-700 flex items-center gap-1.5 text-base font-bold tabular-nums">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="currentColor"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M19.5 12.6L12 20l-7.5-7.4A5 5 0 1 1 12 6a5 5 0 1 1 7.5 6.6z" />
					</svg>
					{likeCount ?? 0}
				</span>
			</Link>

			<Link
				href="/partner/earnings"
				className="bg-secondary-50 flex items-center justify-between rounded-2xl px-4.5 py-4">
				<span className="text-secondary-700 text-sm font-semibold">누적 정산</span>
				<span className="text-secondary-700 text-base font-bold tabular-nums">
					{formatKrw(completedTotalKrw)}
				</span>
			</Link>

			<Link
				href={`/partners/${partnerProfile.profile_id}`}
				className="bg-surface text-body flex items-center justify-between rounded-2xl px-4.5 py-4">
				<span className="text-sm font-semibold">고객에게 보이는 내 프로필</span>
				<svg
					className="text-sub"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round">
					<path d="M9 5l7 7-7 7" />
				</svg>
			</Link>
		</div>
	);
}
