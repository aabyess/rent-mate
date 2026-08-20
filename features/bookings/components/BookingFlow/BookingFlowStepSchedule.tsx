// features/bookings/components/BookingFlow/BookingFlowStepSchedule.tsx
"use client";

import type { JSX } from "react";
import { cn } from "@/utils/cn";
import type { BookingSchedule, BookingTimeRange } from "@/features/bookings/types";
import {
	DURATION_STEP_MINUTES,
	MAX_DURATION_MINUTES,
	MIN_DURATION_MINUTES,
	START_HOURS,
	formatDurationLabel,
	getMonthGrid,
	isStartHourBooked,
} from "@/features/bookings/utils";

const WEEKDAY_HEADERS = ["일", "월", "화", "수", "목", "금", "토"];

type BookingFlowStepScheduleProps = {
	baseDate: { year: number; month: number; day: number };
	availableWeekdays: number[];
	acceptedSlots: BookingTimeRange[];
	schedule: BookingSchedule | null;
	viewYear: number;
	viewMonth: number;
	onMonthChange: (year: number, month: number) => void;
	onScheduleChange: (schedule: BookingSchedule) => void;
};

export function BookingFlowStepSchedule({
	baseDate,
	availableWeekdays,
	acceptedSlots,
	schedule,
	viewYear,
	viewMonth,
	onMonthChange,
	onScheduleChange,
}: BookingFlowStepScheduleProps): JSX.Element {
	const cells = getMonthGrid(viewYear, viewMonth);
	const durationMinutes = schedule?.durationMinutes ?? MIN_DURATION_MINUTES;

	const isPrevDisabled = viewYear === baseDate.year && viewMonth === baseDate.month;

	function handlePrevMonth(): void {
		if (viewMonth === 1) {
			onMonthChange(viewYear - 1, 12);
			return;
		}
		onMonthChange(viewYear, viewMonth - 1);
	}

	function handleNextMonth(): void {
		if (viewMonth === 12) {
			onMonthChange(viewYear + 1, 1);
			return;
		}
		onMonthChange(viewYear, viewMonth + 1);
	}

	function isSelectableDay(day: number): boolean {
		const weekday = new Date(viewYear, viewMonth - 1, day).getDay();
		if (!availableWeekdays.includes(weekday)) {
			return false;
		}
		if (viewYear !== baseDate.year || viewMonth !== baseDate.month) {
			return true;
		}
		return day > baseDate.day;
	}

	function handleDaySelect(day: number): void {
		onScheduleChange({
			year: viewYear,
			month: viewMonth,
			day,
			startHour: schedule?.startHour ?? 14,
			durationMinutes,
		});
	}

	function handleStartHourSelect(startHour: number): void {
		if (!schedule) {
			return;
		}
		onScheduleChange({ ...schedule, startHour });
	}

	function handleDurationChange(delta: number): void {
		if (!schedule) {
			return;
		}
		const next = Math.min(
			MAX_DURATION_MINUTES,
			Math.max(MIN_DURATION_MINUTES, schedule.durationMinutes + delta),
		);
		onScheduleChange({ ...schedule, durationMinutes: next });
	}

	const isSelectedDay = function (day: number): boolean {
		return (
			schedule !== null &&
			schedule.year === viewYear &&
			schedule.month === viewMonth &&
			schedule.day === day
		);
	};

	return (
		<div className="flex flex-col gap-6">
			<section className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<h2 className="text-[17px] font-semibold">
						{viewYear}년 {viewMonth}월
					</h2>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={handlePrevMonth}
							disabled={isPrevDisabled}
							aria-label="이전 달"
							className="bg-surface-alt text-sub flex size-8 items-center justify-center rounded-full disabled:opacity-40">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round">
								<path d="M15 5l-7 7 7 7" />
							</svg>
						</button>
						<button
							type="button"
							onClick={handleNextMonth}
							aria-label="다음 달"
							className="bg-surface-alt text-sub flex size-8 items-center justify-center rounded-full">
							<svg
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
						</button>
					</div>
				</div>
				<div className="grid grid-cols-7 gap-1">
					{WEEKDAY_HEADERS.map(function (label) {
						return (
							<div
								key={label}
								className={cn(
									"flex h-8 items-center justify-center text-xs",
									label === "일" && "text-primary-600",
									label === "토" && "text-trust",
									label !== "일" && label !== "토" && "text-sub",
								)}>
								{label}
							</div>
						);
					})}
					{cells.map(function (day, index) {
						if (day === null) {
							return <div key={`empty-${index}`} className="h-11" />;
						}
						const selectable = isSelectableDay(day);
						const selected = isSelectedDay(day);
						return (
							<button
								key={day}
								type="button"
								disabled={!selectable}
								onClick={function () {
									handleDaySelect(day);
								}}
								className={cn(
									"flex h-11 items-center justify-center rounded-xl text-sm tabular-nums",
									!selectable && "text-line",
									selectable && !selected && "bg-brand-subtle text-primary-600 font-semibold",
									selected && "bg-brand font-bold text-white",
								)}>
								{day}
							</button>
						);
					})}
				</div>
				<div className="text-sub flex items-center gap-3.5 text-xs">
					<span className="flex items-center gap-1.5">
						<span className="bg-brand-subtle size-3 rounded" />
						예약 가능
					</span>
					<span className="flex items-center gap-1.5">
						<span className="bg-surface-alt size-3 rounded" />
						마감
					</span>
				</div>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-[17px] font-semibold">시작 시간</h2>
				<div className="grid grid-cols-4 gap-2">
					{START_HOURS.map(function (hour) {
						const selected = schedule?.startHour === hour;
						const isBooked =
							schedule !== null &&
							isStartHourBooked(
								schedule.year,
								schedule.month,
								schedule.day,
								hour,
								durationMinutes,
								acceptedSlots,
							);
						return (
							<button
								key={hour}
								type="button"
								disabled={!schedule || isBooked}
								onClick={function () {
									handleStartHourSelect(hour);
								}}
								className={cn(
									"flex h-11 items-center justify-center rounded-xl text-sm tabular-nums",
									selected && "bg-brand font-bold text-white",
									!selected && "bg-surface-alt text-body disabled:text-line",
								)}>
								{String(hour).padStart(2, "0")}:00
							</button>
						);
					})}
				</div>
				{schedule !== null && <p className="text-sub text-xs">마감된 시간대는 선택할 수 없어요.</p>}
			</section>

			<section className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<h2 className="text-[17px] font-semibold">이용 시간</h2>
					<span className="text-sub text-xs">최소 2시간</span>
				</div>
				<div className="bg-surface-alt flex items-center justify-between rounded-2xl p-2">
					<button
						type="button"
						disabled={!schedule || durationMinutes <= MIN_DURATION_MINUTES}
						onClick={function () {
							handleDurationChange(-DURATION_STEP_MINUTES);
						}}
						aria-label="이용 시간 줄이기"
						className="bg-surface text-body flex size-11 items-center justify-center rounded-xl disabled:opacity-40">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.2"
							strokeLinecap="round">
							<path d="M5 12h14" />
						</svg>
					</button>
					<span className="text-lg font-bold tabular-nums">
						{formatDurationLabel(durationMinutes)}
					</span>
					<button
						type="button"
						disabled={!schedule || durationMinutes >= MAX_DURATION_MINUTES}
						onClick={function () {
							handleDurationChange(DURATION_STEP_MINUTES);
						}}
						aria-label="이용 시간 늘리기"
						className="bg-brand-subtle text-primary-600 flex size-11 items-center justify-center rounded-xl disabled:opacity-40">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.2"
							strokeLinecap="round">
							<path d="M5 12h14M12 5v14" />
						</svg>
					</button>
				</div>
			</section>
		</div>
	);
}
