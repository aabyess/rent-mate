// features/partners/qna.ts
// 파트너 고정 Q&A 7문항 — 일기(블로그)를 안 쓰는 파트너도 프로필이 비지 않도록 하는 최소 콘텐츠 보장선.
import { COURSE_CATEGORIES } from "@/features/bookings/components/BookingFlow/BookingFlowStepCourse";
import { INTEREST_OPTIONS } from "@/features/partners/utils";

export type PartnerQna = {
	firstImpression: string;
	hobbies: string[];
	genres: string[];
	topicAllNight: string;
	courseCategories: string[];
	smallHappiness: string;
	mbti: string | null;
};

export const EMPTY_QNA: PartnerQna = {
	firstImpression: "",
	hobbies: [],
	genres: [],
	topicAllNight: "",
	courseCategories: [],
	smallHappiness: "",
	mbti: null,
};

export const QNA_HOBBY_OPTIONS = INTEREST_OPTIONS;

export const QNA_GENRE_OPTIONS = [
	"로맨스·멜로",
	"코미디",
	"액션",
	"스릴러",
	"공포",
	"SF",
	"애니메이션",
	"다큐멘터리",
	"드라마",
	"미스터리",
];

// 공개 장소 화이트리스트(예약 코스 카테고리)와 1:1로 매핑 — 새 카테고리 목록은 그대로 재사용한다
export const QNA_COURSE_CATEGORY_OPTIONS = COURSE_CATEGORIES.map(function (category) {
	return category.label;
});

export const MBTI_OPTIONS = [
	"INTJ",
	"INTP",
	"ENTJ",
	"ENTP",
	"INFJ",
	"INFP",
	"ENFJ",
	"ENFP",
	"ISTJ",
	"ISFJ",
	"ESTJ",
	"ESFJ",
	"ISTP",
	"ISFP",
	"ESTP",
	"ESFP",
];

export const QNA_QUESTION_LABELS: Record<keyof PartnerQna, string> = {
	firstImpression: "첫인상은 어땠나요?",
	hobbies: "요즘 취미는?",
	genres: "좋아하는 영화·드라마 장르는?",
	topicAllNight: "밤새 이야기할 수 있는 주제는?",
	courseCategories: "선호하는 데이트 장소는?",
	smallHappiness: "나만의 소소한 행복은?",
	mbti: "MBTI",
};

// qna가 필수 문항을 전부 채웠는지 확인 — MBTI만 선택
export function isQnaComplete(qna: PartnerQna): boolean {
	return (
		qna.firstImpression.trim().length > 0 &&
		qna.hobbies.length > 0 &&
		qna.genres.length > 0 &&
		qna.topicAllNight.trim().length > 0 &&
		qna.courseCategories.length > 0 &&
		qna.smallHappiness.trim().length > 0
	);
}
