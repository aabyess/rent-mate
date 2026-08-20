// features/chats/types.ts

export type ChatMessage = {
	id: string;
	booking_id: string;
	sender_id: string;
	content: string;
	image_url: string | null;
	flagged: boolean;
	created_at: string;
};

export type SendChatMessageInput = {
	bookingId: string;
	content: string;
	imageFile?: File;
};

export type ChatLastMessage = {
	content: string;
	image_url: string | null;
	sender_id: string;
	created_at: string;
};

export type ChatRoomSummary = {
	lastMessage: ChatLastMessage | null;
	unreadCount: number;
};
