// utils/contactLeakKeywords.ts
// 외부 연락처 유도 감지 — 전화번호·이메일·메신저 아이디 유도. 채팅이 앱 밖으로
// 나가면 대화 저장·모니터링(법적 안전조치)이 무력화되는 지점이라 감지해 기록을 남긴다.
// ⚠️ 금칙어 필터(findBannedPhrase)와 달리 차단이 아니다 — 정당한 연락처 교환까지
// 막지 않도록 정책상 "소프트 경고 + 전송 허용 + flagged 등록"이다.
// 감지 기준의 원본은 DB의 flag_banned_chat_content 함수(20260821191000 마이그레이션)다.
// 목록을 바꿀 땐 반드시 DB 함수와 이 파일을 함께 수정할 것.
import { normalizeForDetection } from "@/utils/bannedPhrases";

// 010-1234-5678 / 01012345678 / 02-123-4567 등 국내 전화번호 형식.
// 시각 표현("3시 10분", "10-11시")은 3자리 미만 숫자 그룹이라 접두사(01x/02/0[3-6]x)
// 뒤에 3~4자리+4자리가 이어지는 이 패턴과 겹치지 않는다(실측 합성 케이스로 확인).
const PHONE_PATTERN = /(01[016789]|02|0[3-6][0-4]?)[-.\s]?\d{3,4}[-.\s]?\d{4}(?!\d)/;

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

const MESSENGER_KEYWORDS = [
	"카톡",
	"카카오톡",
	"카카오",
	"라인",
	"텔레그램",
	"텔레",
	"인스타그램",
	"인스타",
	"디엠",
];

// 메신저 아이디로 볼 수 있는 토큰 — 영문으로 시작하는 4~20자, 숫자/언더바/마침표 포함 가능.
// "온라인"처럼 메신저 키워드가 우연히 포함된 일반 문장은 이런 토큰이 없어 걸러진다.
const HANDLE_TOKEN_PATTERN = /\b[a-zA-Z][a-zA-Z0-9_.]{3,19}\b/g;

function looksLikeHandle(token: string): boolean {
	return /[0-9_.]/.test(token);
}

function hasMessengerHandle(content: string): boolean {
	const normalized = normalizeForDetection(content);
	const hasKeyword = MESSENGER_KEYWORDS.some(function (keyword) {
		return normalized.includes(keyword);
	});
	if (!hasKeyword) {
		return false;
	}
	const tokens = content.match(HANDLE_TOKEN_PATTERN) ?? [];
	return tokens.some(function (token) {
		return looksLikeHandle(token);
	});
}

export function findContactInfoLeak(content: string): string | null {
	if (PHONE_PATTERN.test(content)) {
		return "전화번호";
	}
	if (EMAIL_PATTERN.test(content)) {
		return "이메일 주소";
	}
	if (hasMessengerHandle(content)) {
		return "메신저 아이디";
	}
	return null;
}
