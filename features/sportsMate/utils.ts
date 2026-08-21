// features/sportsMate/utils.ts
import { GENDER_MODE_OPTIONS, TIME_SLOT_OPTIONS } from "@/features/sportsMate/constants";
import type { SportsMateGenderMode, SportsMateTimeSlot } from "@/features/sportsMate/types";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const SPORT_EMOJIS: Record<string, string> = {
	배드민턴: "🏸",
	풋살: "⚽",
	볼링: "🎳",
};

export function getSportEmoji(sport: string): string {
	return SPORT_EMOJIS[sport] ?? "🏃";
}

// preferred_date는 시간 정보가 없는 date 컬럼이라 로컬 타임존 파싱으로 하루 밀리는 것을 막는다
export function formatPreferredDate(preferredDate: string): string {
	const [year, month, day] = preferredDate.split("-").map(Number);
	const date = new Date(year, month - 1, day);
	return `${month}월 ${day}일 (${WEEKDAY_LABELS[date.getDay()]})`;
}

export function getTimeSlotLabel(timeSlot: SportsMateTimeSlot): string {
	return (
		TIME_SLOT_OPTIONS.find(function (option) {
			return option.value === timeSlot;
		})?.label ?? timeSlot
	);
}

export function getGenderModeLabel(genderMode: SportsMateGenderMode): string {
	return (
		GENDER_MODE_OPTIONS.find(function (option) {
			return option.value === genderMode;
		})?.label ?? genderMode
	);
}
