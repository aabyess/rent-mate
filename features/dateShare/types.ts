// features/dateShare/types.ts

export type SharedDateDetails = {
	startsAt: string;
	endsAt: string;
	place: string;
	counterpartName: string;
	isAdultVerified: boolean;
	isExpired: boolean;
};

export type DateShareLink = {
	token: string;
	expiresAt: string;
};
