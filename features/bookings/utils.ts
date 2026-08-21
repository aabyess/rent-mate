// features/bookings/utils.ts
import Decimal from "decimal.js";
import type {
	BookingSchedule,
	BookingStatus,
	BookingTimeRange,
	MyBookingItem,
} from "@/features/bookings/types";

// 취소 정책 — DB의 cancel_booking_with_refund RPC와 동일하게 유지할 것
export const FREE_CANCELLATION_WINDOW_HOURS = 24;
export const LATE_CANCELLATION_FEE_RATIO = 0.5;

export type CancellationQuote = {
	feeKrw: number;
	refundKrw: number;
	isFreeCancellation: boolean;
};

// 데이트 시작 24시간 전까지는 무료 취소, 이후에는 결제 금액의 50%가 수수료로 남는다.
// 수수료는 고객에게 유리한 쪽으로 내림 처리한다.
export function calculateCancellationQuote(
	startsAt: string,
	totalAmountKrw: number,
): CancellationQuote {
	const hoursUntilStart = (new Date(startsAt).getTime() - Date.now()) / (1000 * 60 * 60);
	const isFreeCancellation = hoursUntilStart >= FREE_CANCELLATION_WINDOW_HOURS;
	const feeKrw = isFreeCancellation
		? 0
		: new Decimal(totalAmountKrw).times(LATE_CANCELLATION_FEE_RATIO).floor().toNumber();
	const refundKrw = new Decimal(totalAmountKrw).minus(feeKrw).toNumber();
	return { feeKrw, refundKrw, isFreeCancellation };
}

export type CancellationTier = "free" | "partial" | "none";

// 예약 확인 단계의 정책 타임라인 카드에서 "지금 취소하면" 몇 번째 구간에 해당하는지.
export function getCancellationTier(startsAt: string): CancellationTier {
	const hoursUntilStart = (new Date(startsAt).getTime() - Date.now()) / (1000 * 60 * 60);
	if (hoursUntilStart <= 0) {
		return "none";
	}
	return hoursUntilStart >= FREE_CANCELLATION_WINDOW_HOURS ? "free" : "partial";
}

export const MIN_DURATION_MINUTES = 120;
export const MAX_DURATION_MINUTES = 720;
export const DURATION_STEP_MINUTES = 30;
export const START_HOURS = [11, 12, 13, 14, 15, 16, 17, 18];

// 종일권(최대 12시간)을 열되 모든 데이트는 자정 전에 끝나야 한다 —
// 시작 시각이 늦을수록 선택 가능한 이용 시간이 줄어든다.
export function getMaxDurationMinutesForStartHour(startHour: number): number {
	return Math.min(MAX_DURATION_MINUTES, (24 - startHour) * 60);
}

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

// 선택한 날짜·시작 시각·이용 시간이 파트너의 확정된 예약과 겹치는지 — DB의
// EXCLUDE 제약(tstzrange '[)' 반개구간)과 동일한 경계 규칙으로 판정한다.
export function isStartHourBooked(
	year: number,
	month: number,
	day: number,
	startHour: number,
	durationMinutes: number,
	acceptedSlots: BookingTimeRange[],
): boolean {
	const candidateStart = new Date(year, month - 1, day, startHour, 0, 0).getTime();
	const candidateEnd = candidateStart + durationMinutes * 60 * 1000;
	return acceptedSlots.some(function (slot) {
		const slotStart = new Date(slot.starts_at).getTime();
		const slotEnd = new Date(slot.ends_at).getTime();
		return candidateStart < slotEnd && slotStart < candidateEnd;
	});
}

// 시작 시각이 파트너의 가능 시간대(available_start_hour~available_end_hour) 밖이거나,
// 선택한 이용 시간을 더한 종료 시각이 가능 종료를 넘는지 판정한다.
export function isStartHourOutOfAvailability(
	startHour: number,
	durationMinutes: number,
	availableStartHour: number,
	availableEndHour: number,
): boolean {
	const endHour = startHour + durationMinutes / 60;
	return startHour < availableStartHour || endHour > availableEndHour;
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

// DB의 상태 전이 잠금 트리거(accepted→completed는 파트너·시작 이후만)와 동일한 규칙
export function canCompleteBookingNow(booking: MyBookingItem): boolean {
	return booking.status === "accepted" && Date.now() >= new Date(booking.starts_at).getTime();
}

// 노쇼 처리 유예 — DB 전이 트리거(시작 1시간 이후)와 동일하게 유지할 것
export const NO_SHOW_GRACE_MINUTES = 60;

export function canMarkNoShowNow(booking: MyBookingItem): boolean {
	return (
		booking.status === "accepted" &&
		Date.now() >= new Date(booking.starts_at).getTime() + NO_SHOW_GRACE_MINUTES * 60 * 1000
	);
}

// 플랫폼 수수료 — DB의 complete_partner_settlement RPC와 동일하게 유지할 것.
// 클라이언트는 미리보기용, DB 쪽이 최종 권위.
export const PLATFORM_FEE_RATIO = 0.05;

export type EarningsBreakdown = {
	totalKrw: number;
	feeKrw: number;
	netKrw: number;
};

// 수수료는 floor 처리(취소 수수료 계산과 동일한 반올림 컨벤션 재사용)
export function calculateEarningsBreakdown(totalKrw: number): EarningsBreakdown {
	const feeKrw = new Decimal(totalKrw).times(PLATFORM_FEE_RATIO).floor().toNumber();
	const netKrw = new Decimal(totalKrw).minus(feeKrw).toNumber();
	return { totalKrw, feeKrw, netKrw };
}

export type MonthlyEarningsGroup = {
	monthKey: string;
	monthLabel: string;
	bookings: MyBookingItem[];
	subtotalKrw: number;
	feeKrw: number;
	netKrw: number;
};

// 완료된 예약을 데이트 일자(starts_at) 기준 월별로 묶는다 — 최신 달이 먼저
export function groupCompletedBookingsByMonth(bookings: MyBookingItem[]): MonthlyEarningsGroup[] {
	const groupByKey = new Map<string, MyBookingItem[]>();
	for (const booking of bookings) {
		const start = new Date(booking.starts_at);
		const key = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`;
		const group = groupByKey.get(key) ?? [];
		group.push(booking);
		groupByKey.set(key, group);
	}

	return Array.from(groupByKey.entries())
		.sort(function ([a], [b]) {
			return b.localeCompare(a);
		})
		.map(function ([monthKey, monthBookings]) {
			const sorted = [...monthBookings].sort(function (a, b) {
				return new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime();
			});
			const [year, month] = monthKey.split("-");
			const subtotalKrw = sumBookingAmountsKrw(
				sorted.map(function (booking) {
					return booking.total_amount_krw;
				}),
			);
			const { feeKrw, netKrw } = calculateEarningsBreakdown(subtotalKrw);
			return {
				monthKey,
				monthLabel: `${year}년 ${Number(month)}월`,
				bookings: sorted,
				subtotalKrw,
				feeKrw,
				netKrw,
			};
		});
}

const OVERLAP_MESSAGE = "이미 확정된 예약과 시간이 겹쳐요.";

// 예약 수락 시 겹침 에러를 사람이 읽을 수 있는 문구로 통일한다. 대부분은 전이
// 트리거가 이미 이 문구를 그대로 던지지만, 동시 수락 레이스에서는 EXCLUDE
// 제약(23P01)이 대신 막을 수 있어 코드/제약 이름으로도 감지한다.
export function getBookingAcceptErrorMessage(error: { code?: string; message?: string }): string {
	if (
		error.code === "23P01" ||
		error.message?.includes("bookings_no_overlapping_accepted") ||
		error.message === OVERLAP_MESSAGE
	) {
		return OVERLAP_MESSAGE;
	}
	return error.message ?? "예약 수락에 실패했어요.";
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
	requested: "승인 대기",
	accepted: "예약 확정",
	rejected: "거절됨",
	canceled: "취소됨",
	completed: "완료",
	no_show: "노쇼",
};
