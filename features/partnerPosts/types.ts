// features/partnerPosts/types.ts

export type PartnerPost = {
	id: string;
	partner_id: string;
	content: string;
	photo_url: string | null;
	created_at: string;
};

export type CreatePartnerPostInput = {
	content: string;
	photo: File | null;
};
