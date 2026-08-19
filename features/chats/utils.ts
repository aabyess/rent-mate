// features/chats/utils.ts

// 조건만남 유도 감지용 금칙어 (성매매알선처벌법 리스크 — CLAUDE.md 법적 제약 3번)
// 감지 기준의 원본은 DB 트리거(chat_banned_phrase_flagging 마이그레이션)다.
// 이 목록은 전송 전 경고(UX)용 서브셋으로, 트리거 목록 범위 안에서만 유지할 것
const BANNED_PHRASES = [
	"조건만남",
	"스폰",
	"원나잇",
	"잠자리",
	"성관계",
	"유사성행위",
	"성매매",
	"출장만남",
	"모텔",
	"러브호텔",
];

// 띄어쓰기·특수문자로 우회하는 경우를 잡기 위해 한글·영문·숫자만 남기고 비교한다
function normalizeForDetection(content: string): string {
	return content.toLowerCase().replace(/[^가-힣a-z0-9]/g, "");
}

export function findBannedPhrase(content: string): string | null {
	const normalized = normalizeForDetection(content);
	for (const phrase of BANNED_PHRASES) {
		if (normalized.includes(phrase)) {
			return phrase;
		}
	}
	return null;
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
