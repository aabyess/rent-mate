// features/chats/apis.ts
import type {
	ChatLastMessage,
	ChatMessage,
	ChatRoomSummary,
	SendChatMessageInput,
} from "@/features/chats/types";
import { createClient } from "@/libs/supabase/client";

export async function getChatMessages(bookingId: string): Promise<ChatMessage[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("chat_messages")
		.select("id, booking_id, sender_id, content, image_url, flagged, created_at")
		.eq("booking_id", bookingId)
		.order("created_at", { ascending: true });
	if (error) {
		throw error;
	}
	return (data ?? []) as ChatMessage[];
}

// 본인이 속한 예약 폴더({bookingId}/...)에만 업로드 가능 — storage RLS로 강제된다
async function uploadChatImage(bookingId: string, file: File): Promise<string> {
	const supabase = createClient();
	const extension = file.name.split(".").pop() ?? "jpg";
	const path = `${bookingId}/${crypto.randomUUID()}.${extension}`;
	const { error } = await supabase.storage.from("chat-images").upload(path, file);
	if (error) {
		throw error;
	}
	return path;
}

export async function getChatImageSignedUrl(imagePath: string): Promise<string> {
	const supabase = createClient();
	const { data, error } = await supabase.storage
		.from("chat-images")
		.createSignedUrl(imagePath, 3600);
	if (error) {
		throw error;
	}
	return data.signedUrl;
}

export async function postChatMessage({
	bookingId,
	content,
	imageFile,
}: SendChatMessageInput): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const imagePath = imageFile ? await uploadChatImage(bookingId, imageFile) : null;

	const { error } = await supabase.from("chat_messages").insert({
		booking_id: bookingId,
		sender_id: user.id,
		content,
		image_url: imagePath,
	});
	if (error) {
		throw error;
	}
}

export async function postMarkChatRead(bookingId: string): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { error } = await supabase.from("chat_reads").upsert({
		booking_id: bookingId,
		reader_id: user.id,
		last_read_at: new Date().toISOString(),
	});
	if (error) {
		throw error;
	}
}

// 방 수가 적은 전제의 방별 조회 — 규모가 커지면 RPC 집계로 전환한다
export async function getChatRoomSummaries(
	bookingIds: string[],
): Promise<Record<string, ChatRoomSummary>> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user || bookingIds.length === 0) {
		return {};
	}

	const { data: reads, error: readsError } = await supabase
		.from("chat_reads")
		.select("booking_id, last_read_at")
		.eq("reader_id", user.id)
		.in("booking_id", bookingIds);
	if (readsError) {
		throw readsError;
	}
	const lastReadByBookingId = new Map<string, string>();
	for (const row of (reads ?? []) as { booking_id: string; last_read_at: string }[]) {
		lastReadByBookingId.set(row.booking_id, row.last_read_at);
	}

	const summaries: Record<string, ChatRoomSummary> = {};
	await Promise.all(
		bookingIds.map(async function (bookingId) {
			const { data: lastRows, error: lastError } = await supabase
				.from("chat_messages")
				.select("content, image_url, sender_id, created_at")
				.eq("booking_id", bookingId)
				.order("created_at", { ascending: false })
				.limit(1);
			if (lastError) {
				throw lastError;
			}
			const lastMessage = (lastRows?.[0] ?? null) as ChatLastMessage | null;

			let unreadCount = 0;
			if (lastMessage && lastMessage.sender_id !== user.id) {
				let countQuery = supabase
					.from("chat_messages")
					.select("id", { count: "exact", head: true })
					.eq("booking_id", bookingId)
					.neq("sender_id", user.id);
				const lastReadAt = lastReadByBookingId.get(bookingId);
				if (lastReadAt) {
					countQuery = countQuery.gt("created_at", lastReadAt);
				}
				const { count, error: countError } = await countQuery;
				if (countError) {
					throw countError;
				}
				unreadCount = count ?? 0;
			}
			summaries[bookingId] = { lastMessage, unreadCount };
		}),
	);
	return summaries;
}
