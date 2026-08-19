// features/partners/utils.ts
import Decimal from "decimal.js";
import type { PartnerCardItem, PartnerListItem } from "@/features/partners/types";

const NEW_BADGE_DAYS = 14;

// 등록·수정 폼이 공유하는 옵션 목록 — 값이 갈리면 등록/수정 결과가 달라지므로 한 곳에서만 정의한다
export const INTEREST_OPTIONS = [
	"카페 투어",
	"전시 관람",
	"산책",
	"맛집 탐방",
	"영화",
	"보드게임",
	"사진",
	"서점 데이트",
	"브런치",
	"디저트 투어",
];

export const WEEKDAY_OPTIONS = [
	{ value: 0, label: "일" },
	{ value: 1, label: "월" },
	{ value: 2, label: "화" },
	{ value: 3, label: "수" },
	{ value: 4, label: "목" },
	{ value: 5, label: "금" },
	{ value: 6, label: "토" },
];

export const MIN_HOURLY_RATE_KRW = 10000;

export function markNewPartners(partners: PartnerListItem[]): PartnerCardItem[] {
	const now = Date.now();
	return partners.map(function (partner) {
		return {
			...partner,
			isNew: now - new Date(partner.created_at).getTime() < NEW_BADGE_DAYS * 24 * 60 * 60 * 1000,
		};
	});
}

export function calculateAgeFromBirthYear(birthYear: number): number {
	return new Date().getFullYear() - birthYear;
}

export function formatKrw(amount: number): string {
	return `₩${amount.toLocaleString("ko-KR")}`;
}

export function calculateBaseTwoHourPrice(hourlyRateKrw: number): number {
	return new Decimal(hourlyRateKrw).times(2).toNumber();
}

export function calculateHalfHourExtensionPrice(hourlyRateKrw: number): number {
	return new Decimal(hourlyRateKrw).div(2).toNumber();
}
