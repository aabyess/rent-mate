// features/reviews/types.ts

export type ReviewRow = {
	id: string;
	booking_id: string;
	partner_id: string;
	author_id: string;
	rating: number;
	timeliness_rating: number | null;
	manner_rating: number | null;
	safety_rating: number | null;
	would_meet_again_rating: number | null;
	content: string;
	created_at: string;
};

export type CreateReviewInput = {
	bookingId: string;
	partnerId: string;
	timelinessRating: number;
	mannerRating: number;
	safetyRating: number;
	wouldMeetAgainRating: number;
	content: string;
};

export type PartnerRatingSummary = {
	average: number;
	count: number;
};

export type MyReviewItem = ReviewRow & {
	partnerNickname: string;
};
