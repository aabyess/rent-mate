// features/partners/types.ts

export type PartnerCardItem = PartnerListItem & {
	isNew: boolean;
};

export type PartnerListItem = {
	profile_id: string;
	nickname: string;
	bio: string;
	hourly_rate_krw: number;
	photo_urls: string[];
	birth_year: number | null;
	interests: string[];
	created_at: string;
};
