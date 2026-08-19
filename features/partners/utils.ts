// features/partners/utils.ts
import type { PartnerCardItem, PartnerListItem } from "@/features/partners/types";

const NEW_BADGE_DAYS = 14;

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
