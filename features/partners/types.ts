// features/partners/types.ts
import type { PartnerQna } from "@/features/partners/qna";

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
	availableStartHour: number;
	availableEndHour: number;
	photos: File[];
	region: string;
	purposeTags: string[];
	qna: PartnerQna;
};

export type PatchPartnerProfileInput = {
	nickname: string;
	bio: string;
	hourlyRateKrw: number;
	heightCm: number | null;
	weightKg: number | null;
	interests: string[];
	availableWeekdays: number[];
	availableStartHour: number;
	availableEndHour: number;
	region: string;
	purposeTags: string[];
	qna: PartnerQna;
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
	available_start_hour: number;
	available_end_hour: number;
	region: string;
	purpose_tags: string[];
	gender: "male" | "female";
	blog_greeting: string | null;
	blog_cover_url: string | null;
	qna: PartnerQna;
	created_at: string;
};
