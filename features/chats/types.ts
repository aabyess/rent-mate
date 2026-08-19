// features/chats/types.ts

export type ChatMessage = {
	id: string;
	booking_id: string;
	sender_id: string;
	content: string;
	created_at: string;
};

export type SendChatMessageInput = {
	bookingId: string;
	content: string;
};
