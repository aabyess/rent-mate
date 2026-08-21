// features/sportsMate/constants.ts
import type { SportsMateGenderMode, SportsMateTimeSlot } from "@/features/sportsMate/types";

// features/bookings/components/BookingFlow/BookingFlowStepCourse.tsx의 COURSE_CATEGORIES
// 운동 항목(배드민턴·풋살·볼링)과 라벨을 동기화할 것
export const SPORT_OPTIONS = ["배드민턴", "풋살", "볼링"] as const;

export const TIME_SLOT_OPTIONS: { value: SportsMateTimeSlot; label: string }[] = [
	{ value: "morning", label: "오전" },
	{ value: "afternoon", label: "오후" },
	{ value: "evening", label: "저녁" },
	{ value: "anytime", label: "시간 무관" },
];

export const GENDER_MODE_OPTIONS: { value: SportsMateGenderMode; label: string }[] = [
	{ value: "same_gender", label: "동성만" },
	{ value: "any", label: "성별 무관" },
];

export const SPORTS_MATE_COMMENT_MAX_LENGTH = 100;
