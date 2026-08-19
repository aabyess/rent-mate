// features/bookings/components/BookingFlow/index.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { BookingFlowStepConfirm } from "@/features/bookings/components/BookingFlow/BookingFlowStepConfirm";
import { BookingFlowStepCourse } from "@/features/bookings/components/BookingFlow/BookingFlowStepCourse";
import { BookingFlowStepPayment } from "@/features/bookings/components/BookingFlow/BookingFlowStepPayment";
import { BookingFlowStepSchedule } from "@/features/bookings/components/BookingFlow/BookingFlowStepSchedule";
import { useCreateBookingMutation } from "@/features/bookings/mutations";
import type { BookingSchedule } from "@/features/bookings/types";
import {
	calculateTotalPriceKrw,
	formatScheduleLabel,
	toBookingRange,
} from "@/features/bookings/utils";
import { usePartnerDetailQuery } from "@/features/partners/queries";
import { formatKrw } from "@/features/partners/utils";
import { cn } from "@/utils/cn";

const NOW = new Date();
const BASE_DATE = { year: NOW.getFullYear(), month: NOW.getMonth() + 1, day: NOW.getDate() };

const STEP_TITLES = ["날짜·시간", "코스·장소", "예약 확인", "결제"];
const STEP_CTA_LABELS = ["다음 · 코스 선택", "다음 · 예약 확인", "다음 · 결제"];

type BookingFlowProps = {
	partnerId: string;
};

export function BookingFlow({ partnerId }: BookingFlowProps): JSX.Element {
	const router = useRouter();
	const { data: partner, isPending: isPartnerPending } = usePartnerDetailQuery(partnerId);
	const createBookingMutation = useCreateBookingMutation();

	const [step, setStep] = useState(1);
	const [viewYear, setViewYear] = useState(BASE_DATE.year);
	const [viewMonth, setViewMonth] = useState(BASE_DATE.month);
	const [schedule, setSchedule] = useState<BookingSchedule | null>(null);
	const [category, setCategory] = useState<string | null>(null);
	const [placeDetail, setPlaceDetail] = useState("");
	const [isAgreed, setIsAgreed] = useState(false);

	if (isPartnerPending) {
		return (
			<div className="flex flex-col gap-4 px-5 py-5">
				<div className="bg-surface-alt h-7 w-1/3 animate-pulse rounded" />
				<div className="bg-surface-alt h-72 animate-pulse rounded-2xl" />
			</div>
		);
	}

	if (!partner) {
		return (
			<div className="flex flex-col items-center gap-4 py-24">
				<p className="text-sub text-sm">파트너를 찾을 수 없어요.</p>
				<Link href="/" className="text-brand font-medium underline">
					홈으로 돌아가기
				</Link>
			</div>
		);
	}

	const totalPriceKrw = schedule
		? calculateTotalPriceKrw(partner.hourly_rate_krw, schedule.durationMinutes)
		: 0;
	const place = category ? `${category} · ${placeDetail.trim()}` : placeDetail.trim();

	if (createBookingMutation.isSuccess) {
		return (
			<div className="flex flex-col items-center gap-5 px-5 py-24">
				<span className="bg-secondary-50 flex size-16 items-center justify-center rounded-full">
					<svg
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#2e9995"
						strokeWidth="2.4"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M5 12l5 5 9-10" />
					</svg>
				</span>
				<div className="flex flex-col items-center gap-1.5">
					<h1 className="text-xl font-bold">예약 요청 완료!</h1>
					<p className="text-sub text-center text-sm">
						{partner.nickname}님이 승인하면 예약이 확정돼요.
						<br />
						확정되면 채팅으로 알려드릴게요.
					</p>
				</div>
				<div className="flex w-full flex-col gap-2">
					<Button
						fullWidth
						onClick={function () {
							router.replace("/bookings");
						}}>
						예약 내역 보기
					</Button>
					<Button
						variant="ghost"
						fullWidth
						onClick={function () {
							router.replace("/");
						}}>
						홈으로
					</Button>
				</div>
			</div>
		);
	}

	const isStepValid =
		(step === 1 && schedule !== null) ||
		(step === 2 && category !== null && placeDetail.trim().length >= 2) ||
		(step === 3 && isAgreed) ||
		step === 4;

	function handleBack(): void {
		if (step > 1) {
			setStep(step - 1);
			return;
		}
		router.back();
	}

	function handleNext(): void {
		if (step < 4) {
			setStep(step + 1);
			return;
		}
		if (!schedule) {
			return;
		}
		const { startsAt, endsAt } = toBookingRange(schedule);
		createBookingMutation.mutate({
			partnerId,
			startsAt,
			endsAt,
			place,
			totalAmountKrw: totalPriceKrw,
		});
	}

	function handleMonthChange(year: number, month: number): void {
		setViewYear(year);
		setViewMonth(month);
	}

	return (
		<div className="flex min-h-screen flex-col">
			<header className="border-line flex flex-col gap-3.5 border-b px-5 py-4">
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
					<h1 className="text-lg font-bold">예약하기</h1>
					<span className="text-sub ml-auto text-[13px]">{partner.nickname} 님</span>
				</div>
				<div className="flex items-center gap-1.5">
					{STEP_TITLES.map(function (title, index) {
						const stepNumber = index + 1;
						const isActive = stepNumber === step;
						const isDone = stepNumber < step;
						return (
							<div key={title} className="flex grow items-center gap-1.5 last:grow-0">
								<div className="flex items-center gap-1.5">
									<span
										className={cn(
											"flex size-6 items-center justify-center rounded-full text-xs font-bold",
											(isActive || isDone) && "bg-brand text-white",
											!isActive && !isDone && "bg-surface-alt text-neutral-400",
										)}>
										{stepNumber}
									</span>
									{isActive && (
										<span className="text-primary-600 text-[13px] font-semibold">{title}</span>
									)}
								</div>
								{stepNumber < STEP_TITLES.length && (
									<span className="bg-line h-0.5 grow rounded-full" />
								)}
							</div>
						);
					})}
				</div>
			</header>

			<div className="grow px-5 py-5 pb-44">
				{step === 1 && (
					<BookingFlowStepSchedule
						baseDate={BASE_DATE}
						schedule={schedule}
						viewYear={viewYear}
						viewMonth={viewMonth}
						onMonthChange={handleMonthChange}
						onScheduleChange={setSchedule}
					/>
				)}
				{step === 2 && (
					<BookingFlowStepCourse
						category={category}
						placeDetail={placeDetail}
						onCategoryChange={setCategory}
						onPlaceDetailChange={setPlaceDetail}
					/>
				)}
				{step === 3 && schedule && (
					<BookingFlowStepConfirm
						partnerNickname={partner.nickname}
						schedule={schedule}
						place={place}
						totalPriceKrw={totalPriceKrw}
						isAgreed={isAgreed}
						onAgreedChange={setIsAgreed}
					/>
				)}
				{step === 4 && <BookingFlowStepPayment totalPriceKrw={totalPriceKrw} />}
			</div>

			<footer className="border-line bg-surface/80 fixed bottom-0 left-1/2 z-10 flex w-full max-w-md -translate-x-1/2 flex-col gap-2.5 border-t px-5 pt-3.5 pb-6 backdrop-blur-xl">
				<div className="flex items-center justify-between">
					<span className="text-sub text-[13px] tabular-nums">
						{schedule ? formatScheduleLabel(schedule) : "날짜와 시간을 선택해주세요"}
					</span>
					<span className="text-xl font-bold tabular-nums">{formatKrw(totalPriceKrw)}</span>
				</div>
				{createBookingMutation.isError && (
					<p className="text-error-500 text-sm">{createBookingMutation.error.message}</p>
				)}
				<Button
					size="lg"
					fullWidth
					disabled={!isStepValid || createBookingMutation.isPending}
					onClick={handleNext}>
					{step < 4 && STEP_CTA_LABELS[step - 1]}
					{step === 4 &&
						(createBookingMutation.isPending
							? "결제 중..."
							: `${formatKrw(totalPriceKrw)} 결제하기`)}
				</Button>
				<p className="text-sub flex items-center justify-center gap-1.5 text-xs">
					<svg
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#2e9995"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" />
						<path d="M9 12l2 2 4-4" />
					</svg>
					결제 금액은 데이트 완료 후 파트너에게 정산됩니다
				</p>
			</footer>
		</div>
	);
}
