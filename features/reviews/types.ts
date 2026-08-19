// features/reviews/types.ts

export type ReviewRow = {
	id: string;
	booking_id: string;
	partner_id: string;
	author_id: string;
	rating: number;
	content: string;
	created_at: string;
};

export type CreateReviewInput = {
	bookingId: string;
	partnerId: string;
	rating: number;
	content: string;
};

export type PartnerRatingSummary = {
	average: number;
	count: number;
};
