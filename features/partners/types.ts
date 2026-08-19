// features/partners/types.ts

export type PartnerCardItem = PartnerListItem & {
	isNew: boolean;
};

export type PartnerDetailItem = PartnerListItem;

export type MyPartnerProfile = PartnerListItem & {
	is_approved: boolean;
	is_active: boolean;
};

export type CreatePartnerProfileInput = {
	nickname: string;
	bio: string;
	hourlyRateKrw: number;
	birthYear: number;
	interests: string[];
	availableWeekdays: number[];
	photos: File[];
	region: string;
};

export type PartnerListItem = {
	profile_id: string;
	nickname: string;
	bio: string;
	hourly_rate_krw: number;
	photo_urls: string[];
	birth_year: number | null;
	interests: string[];
	available_weekdays: number[];
	region: string;
	created_at: string;
};
