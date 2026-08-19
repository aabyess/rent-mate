// features/chats/apis.ts
import type { ChatMessage, SendChatMessageInput } from "@/features/chats/types";
import { createClient } from "@/libs/supabase/client";

export async function getChatMessages(bookingId: string): Promise<ChatMessage[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("chat_messages")
		.select("id, booking_id, sender_id, content, flagged, created_at")
		.eq("booking_id", bookingId)
		.order("created_at", { ascending: true });
	if (error) {
		throw error;
	}
	return (data ?? []) as ChatMessage[];
}

export async function postChatMessage({ bookingId, content }: SendChatMessageInput): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { error } = await supabase.from("chat_messages").insert({
		booking_id: bookingId,
		sender_id: user.id,
		content,
	});
	if (error) {
		throw error;
	}
}
