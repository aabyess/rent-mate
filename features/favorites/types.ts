// features/favorites/types.ts

export type FavoriteState = {
	isLiked: boolean;
	isBookmarked: boolean;
};

export type BookmarkedPartner = {
	profile_id: string;
	nickname: string;
	photo_urls: string[];
	region: string;
	hourly_rate_krw: number;
	purpose_tags: string[];
};
