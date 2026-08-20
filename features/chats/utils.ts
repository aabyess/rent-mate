// features/chats/utils.ts
import type { ChatLastMessage } from "@/features/chats/types";

// 이미지만 보낸 메시지는 content가 빈 문자열이라 목록 미리보기 텍스트로 대체한다
export function formatChatListPreview(lastMessage: ChatLastMessage): string {
	if (lastMessage.content.length > 0) {
		return lastMessage.content;
	}
	if (lastMessage.image_url !== null) {
		return "사진을 보냈어요";
	}
	return "";
}

export function formatChatListTime(createdAt: string): string {
	const date = new Date(createdAt);
	const now = new Date();
	const isToday =
		date.getFullYear() === now.getFullYear() &&
		date.getMonth() === now.getMonth() &&
		date.getDate() === now.getDate();
	if (isToday) {
		const pad = function (value: number): string {
			return String(value).padStart(2, "0");
		};
		return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
	}
	return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}
