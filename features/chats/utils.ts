// features/chats/utils.ts

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
