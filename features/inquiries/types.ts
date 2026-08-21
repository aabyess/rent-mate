// features/inquiries/types.ts

export type InquiryStatus = "open" | "answered";

export type InquiryRow = {
	id: string;
	category: string;
	content: string;
	status: InquiryStatus;
	answer: string | null;
	answered_at: string | null;
	created_at: string;
};

export type AdminInquiryItem = InquiryRow & {
	profile_id: string;
	authorName: string;
};

export type CreateInquiryInput = {
	category: string;
	content: string;
};
