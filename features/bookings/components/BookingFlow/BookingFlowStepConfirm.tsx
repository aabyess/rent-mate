// features/bookings/components/BookingFlow/BookingFlowStepConfirm.tsx
"use client";

import type { JSX, ReactNode } from "react";
import type { BookingSchedule } from "@/features/bookings/types";
import {
	FREE_CANCELLATION_WINDOW_HOURS,
	LATE_CANCELLATION_FEE_RATIO,
	formatDurationLabel,
	formatScheduleLabel,
	getCancellationTier,
	toBookingRange,
	type CancellationTier,
} from "@/features/bookings/utils";
import { formatKrw } from "@/features/partners/utils";
import { cn } from "@/utils/cn";

const SAFETY_RULES = [
	"데이트는 예약한 공개 장소에서만 진행돼요.",
	"신체 접촉·성적 언행 등 금지 행위 시 계정이 영구 제한되고 관련 법에 따라 신고될 수 있어요.",
	"대화 내용은 안전을 위해 저장되며 삭제할 수 없어요.",
];

const FULL_REFUND_PERCENT = 100;
const PARTIAL_REFUND_PERCENT = (1 - LATE_CANCELLATION_FEE_RATIO) * 100;

const REFUND_TIER_ICONS: Record<CancellationTier, ReactNode> = {
	free: (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<circle cx="12" cy="12" r="9" />
			<path d="M8 12l3 3 5-6" />
		</svg>
	),
	partial: (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<circle cx="12" cy="12" r="9" />
			<path d="M12 7v5l3.5 2" />
		</svg>
	),
	none: (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<circle cx="12" cy="12" r="9" />
			<path d="M9.5 9.5l5 5m0-5l-5 5" />
		</svg>
	),
};

type BookingFlowStepConfirmProps = {
	partnerNickname: string;
	schedule: BookingSchedule;
	place: string;
	totalPriceKrw: number;
	isAgreed: boolean;
	onAgreedChange: (isAgreed: boolean) => void;
};

export function BookingFlowStepConfirm({
	partnerNickname,
	schedule,
	place,
	totalPriceKrw,
	isAgreed,
	onAgreedChange,
}: BookingFlowStepConfirmProps): JSX.Element {
	const { startsAt } = toBookingRange(schedule);
	const activeTier = getCancellationTier(startsAt);
	const REFUND_TIERS: { tier: CancellationTier; percentLabel: string; rangeLabel: string }[] = [
		{ tier: "free", percentLabel: `${FULL_REFUND_PERCENT}%`, rangeLabel: "지금 취소" },
		{
			tier: "partial",
			percentLabel: `${PARTIAL_REFUND_PERCENT}%`,
			rangeLabel: `시작 ${FREE_CANCELLATION_WINDOW_HOURS}시간 전까지`,
		},
		{ tier: "none", percentLabel: "환불 불가", rangeLabel: "이후" },
	];

	return (
		<div className="flex flex-col gap-6">
			<section className="flex flex-col gap-3">
				<h2 className="text-[17px] font-semibold">예약 내용을 확인해주세요</h2>
				<dl className="bg-surface-alt flex flex-col overflow-hidden rounded-2xl">
					<div className="flex items-center justify-between px-4 py-3.5">
						<dt className="text-sub text-sm">파트너</dt>
						<dd className="text-[15px] font-semibold">{partnerNickname}</dd>
					</div>
					<div className="flex items-center justify-between px-4 py-3.5">
						<dt className="text-sub text-sm">일시</dt>
						<dd className="text-[15px] font-semibold tabular-nums">
							{formatScheduleLabel(schedule)}
						</dd>
					</div>
					<div className="flex items-center justify-between px-4 py-3.5">
						<dt className="text-sub text-sm">이용 시간</dt>
						<dd className="text-[15px] font-semibold">
							{formatDurationLabel(schedule.durationMinutes)}
						</dd>
					</div>
					<div className="flex items-center justify-between px-4 py-3.5">
						<dt className="text-sub text-sm">장소</dt>
						<dd className="text-[15px] font-semibold">{place}</dd>
					</div>
					<div className="bg-brand-subtle flex items-center justify-between px-4 py-3.5">
						<dt className="text-primary-700 text-sm font-medium">결제 금액</dt>
						<dd className="text-primary-700 text-base font-bold tabular-nums">
							{formatKrw(totalPriceKrw)}
						</dd>
					</div>
				</dl>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-[17px] font-semibold">취소·환불 정책</h2>
				<div className="flex flex-col gap-2">
					{REFUND_TIERS.map(function (item) {
						const isActive = item.tier === activeTier;
						return (
							<div
								key={item.tier}
								className={cn(
									"flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5",
									isActive ? "border-brand bg-brand-subtle" : "border-line bg-surface",
								)}>
								<span className={cn("shrink-0", isActive ? "text-brand" : "text-sub")}>
									{REFUND_TIER_ICONS[item.tier]}
								</span>
								<div className="flex flex-col gap-0.5">
									<span
										className={cn(
											"text-base font-bold",
											isActive ? "text-primary-700" : "text-body",
										)}>
										{item.percentLabel}
									</span>
									<span className="text-sub text-xs">{item.rangeLabel}</span>
								</div>
							</div>
						);
					})}
				</div>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-[17px] font-semibold">안전 수칙</h2>
				<ul className="bg-warning-500/15 flex flex-col gap-2 rounded-2xl px-4 py-4">
					{SAFETY_RULES.map(function (rule) {
						return (
							<li key={rule} className="text-warning-500 flex gap-2 text-[13px] leading-relaxed">
								<span aria-hidden="true">·</span>
								{rule}
							</li>
						);
					})}
				</ul>
				<button
					type="button"
					onClick={function () {
						onAgreedChange(!isAgreed);
					}}
					className="bg-surface-alt flex items-center gap-2.5 rounded-2xl px-4 py-3.5 text-left">
					<span
						className={cn(
							"flex size-5 shrink-0 items-center justify-center rounded-full",
							isAgreed && "bg-brand",
							!isAgreed && "bg-surface border border-neutral-300",
						)}>
						{isAgreed && (
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#ffffff"
								strokeWidth="3"
								strokeLinecap="round"
								strokeLinejoin="round">
								<path d="M5 12l5 5 9-10" />
							</svg>
						)}
					</span>
					<span className="text-sm">안전 수칙과 금지 행위 정책을 확인했고, 동의합니다.</span>
				</button>
			</section>
		</div>
	);
}
