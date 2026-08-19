// features/bookings/utils.ts
import Decimal from "decimal.js";
import type { BookingSchedule, BookingStatus } from "@/features/bookings/types";

export const MIN_DURATION_MINUTES = 120;
export const MAX_DURATION_MINUTES = 480;
export const DURATION_STEP_MINUTES = 30;
export const START_HOURS = [11, 12, 13, 14, 15, 16, 17, 18];

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function calculateTotalPriceKrw(hourlyRateKrw: number, durationMinutes: number): number {
	return new Decimal(hourlyRateKrw).times(durationMinutes).div(60).toNumber();
}

// 달력 그리드: 앞쪽 빈 칸은 null, 이후 1..말일
export function getMonthGrid(year: number, month: number): (number | null)[] {
	const firstWeekday = new Date(year, month - 1, 1).getDay();
	const lastDate = new Date(year, month, 0).getDate();
	const cells: (number | null)[] = [];
	for (let i = 0; i < firstWeekday; i += 1) {
		cells.push(null);
	}
	for (let day = 1; day <= lastDate; day += 1) {
		cells.push(day);
	}
	return cells;
}

export function formatDurationLabel(durationMinutes: number): string {
	const hours = Math.floor(durationMinutes / 60);
	const minutes = durationMinutes % 60;
	if (minutes === 0) {
		return `${hours}시간`;
	}
	return `${hours}시간 ${minutes}분`;
}

export function formatScheduleLabel(schedule: BookingSchedule): string {
	const { year, month, day, startHour, durationMinutes } = schedule;
	const weekday = WEEKDAY_LABELS[new Date(year, month - 1, day).getDay()];
	const endTotalMinutes = startHour * 60 + durationMinutes;
	const endHour = Math.floor(endTotalMinutes / 60);
	const endMinute = endTotalMinutes % 60;
	const endLabel = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
	return `${month}월 ${day}일 (${weekday}) ${String(startHour).padStart(2, "0")}:00 – ${endLabel}`;
}

export function toBookingRange(schedule: BookingSchedule): { startsAt: string; endsAt: string } {
	const start = new Date(schedule.year, schedule.month - 1, schedule.day, schedule.startHour, 0, 0);
	const end = new Date(start.getTime() + schedule.durationMinutes * 60 * 1000);
	return { startsAt: start.toISOString(), endsAt: end.toISOString() };
}

export function formatBookingPeriod(startsAt: string, endsAt: string): string {
	const start = new Date(startsAt);
	const end = new Date(endsAt);
	const weekday = WEEKDAY_LABELS[start.getDay()];
	const pad = function (value: number): string {
		return String(value).padStart(2, "0");
	};
	return `${start.getMonth() + 1}월 ${start.getDate()}일 (${weekday}) ${pad(start.getHours())}:${pad(start.getMinutes())} – ${pad(end.getHours())}:${pad(end.getMinutes())}`;
}

export function sumBookingAmountsKrw(amounts: number[]): number {
	return amounts
		.reduce(function (total, amount) {
			return total.plus(amount);
		}, new Decimal(0))
		.toNumber();
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
	requested: "승인 대기",
	accepted: "예약 확정",
	rejected: "거절됨",
	canceled: "취소됨",
	completed: "완료",
};
