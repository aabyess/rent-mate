// utils/bannedPhrases.ts
// 성매매·조건만남 유도 표현 감지 (성매매알선처벌법 리스크 — CLAUDE.md 법적 제약 3번).
// 채팅·파트너 프로필·후기·예약 장소 등 모든 사용자 입력면에서 이 유틸을 공용으로 쓴다.
// ⚠️ 감지 기준의 원본은 DB의 contains_banned_phrase 함수(20260820160000 마이그레이션)다.
// 목록을 바꿀 땐 반드시 DB 함수와 이 배열을 함께 수정할 것.
export const BANNED_PHRASES = [
	"조건만남",
	"조건녀",
	"스폰",
	"원나잇",
	"잠자리",
	"성관계",
	"유사성행위",
	"성매매",
	"출장만남",
	"출장안마",
	"모텔",
	"러브호텔",
	"섹스",
	"섹파",
	"화대",
	"페이만남",
	"키스방",
	"안마방",
	"풀싸롱",
	"립카페",
	"핸플",
	"대딸",
	"오랄",
];

// 띄어쓰기·특수문자로 우회하는 경우("조 건 만 남", "조*건*만*남")를 잡기 위해
// 한글·영문·숫자만 남기고 비교한다
export function normalizeForDetection(content: string): string {
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
