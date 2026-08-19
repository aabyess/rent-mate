// constants/purposeTags.ts

export const PURPOSE_TAG_DATING_PRACTICE = "연애 연습";
export const PURPOSE_TAG_CONVERSATION_PRACTICE = "대화 연습";
export const PURPOSE_TAG_FIRST_DATE_REHEARSAL = "첫 데이트 리허설";
export const PURPOSE_TAG_BLIND_DATE_REHEARSAL = "소개팅 예행연습";
export const PURPOSE_TAG_HOBBY_MATE = "취미 메이트";

export const PURPOSE_TAGS = [
	PURPOSE_TAG_DATING_PRACTICE,
	PURPOSE_TAG_CONVERSATION_PRACTICE,
	PURPOSE_TAG_FIRST_DATE_REHEARSAL,
	PURPOSE_TAG_BLIND_DATE_REHEARSAL,
	PURPOSE_TAG_HOBBY_MATE,
] as const;

export type PurposeTag = (typeof PURPOSE_TAGS)[number];
