// utils/appearanceKeywords.ts
// 외모·신체 평가 소프트 가드 — bannedPhrases(등록 차단)와 별개다. 등록은 그대로 허용하고
// 게시 전 안내만 한다("외모보다 매너·대화·시간약속 경험을 남겨주세요") — 성인 서비스 연상
// 프레임을 낮추려는 넛지일 뿐, 정상적인 표현까지 막을 필요는 없어 경고에 그친다.
const APPEARANCE_KEYWORDS = ["예쁘", "이쁘", "잘생", "몸매", "섹시", "글래머"];

export function findAppearanceKeyword(content: string): string | null {
	for (const keyword of APPEARANCE_KEYWORDS) {
		if (content.includes(keyword)) {
			return keyword;
		}
	}
	return null;
}
