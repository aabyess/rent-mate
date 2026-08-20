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
	heightCm: number | null;
	weightKg: number | null;
	interests: string[];
	availableWeekdays: number[];
	photos: File[];
	region: string;
	purposeTags: string[];
};

export type PatchPartnerProfileInput = {
	nickname: string;
	bio: string;
	hourlyRateKrw: number;
	heightCm: number | null;
	weightKg: number | null;
	interests: string[];
	availableWeekdays: number[];
	region: string;
	purposeTags: string[];
	existingPhotoUrls: string[];
	newPhotos: File[];
};

export type PartnerListItem = {
	profile_id: string;
	nickname: string;
	bio: string;
	hourly_rate_krw: number;
	photo_urls: string[];
	birth_year: number | null;
	height_cm: number | null;
	weight_kg: number | null;
	interests: string[];
	available_weekdays: number[];
	region: string;
	purpose_tags: string[];
	gender: "male" | "female";
	created_at: string;
};
