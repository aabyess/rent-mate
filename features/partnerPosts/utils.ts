// features/partnerPosts/utils.ts

export function formatPostTime(createdAt: string): string {
	const date = new Date(createdAt);
	const diffMs = Date.now() - date.getTime();
	const diffMinutes = Math.floor(diffMs / 60000);
	if (diffMinutes < 1) {
		return "방금 전";
	}
	if (diffMinutes < 60) {
		return `${diffMinutes}분 전`;
	}
	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) {
		return `${diffHours}시간 전`;
	}
	return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}
