// features/partners/components/PartnerDetail/PartnerDetailQna.tsx
import type { JSX } from "react";
import {
	EMPTY_QNA,
	isQnaComplete,
	QNA_QUESTION_LABELS,
	type PartnerQna,
} from "@/features/partners/qna";

type PartnerDetailQnaProps = {
	qna: PartnerQna;
};

// 필수 문항이 다 채워졌을 때만 렌더 — 미완성 프로필은 빈 카드를 보이지 않는다
export function PartnerDetailQna({ qna }: PartnerDetailQnaProps): JSX.Element | null {
	// 기존 파트너는 qna가 '{}'(빈 객체)라 필드가 undefined일 수 있다 — 폼과 동일하게
	// EMPTY_QNA로 보정하지 않으면 undefined.trim()으로 상세 화면 전체가 죽는다
	const merged: PartnerQna = { ...EMPTY_QNA, ...qna };
	if (!isQnaComplete(merged)) {
		return null;
	}

	const entries = [
		{ label: QNA_QUESTION_LABELS.firstImpression, value: merged.firstImpression },
		{ label: QNA_QUESTION_LABELS.hobbies, value: merged.hobbies.join(", ") },
		{ label: QNA_QUESTION_LABELS.genres, value: merged.genres.join(", ") },
		{ label: QNA_QUESTION_LABELS.topicAllNight, value: merged.topicAllNight },
		{ label: QNA_QUESTION_LABELS.courseCategories, value: merged.courseCategories.join(", ") },
		{ label: QNA_QUESTION_LABELS.smallHappiness, value: merged.smallHappiness },
	];
	if (merged.mbti) {
		entries.push({ label: QNA_QUESTION_LABELS.mbti, value: merged.mbti });
	}

	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-[17px] font-semibold">Q&A</h2>
			<div className="bg-surface-alt divide-line flex flex-col divide-y rounded-2xl">
				{entries.map(function (entry) {
					return (
						<div key={entry.label} className="flex flex-col gap-1 px-4 py-3.5">
							<span className="text-sub text-xs font-medium">{entry.label}</span>
							<span className="text-[15px] leading-relaxed">{entry.value}</span>
						</div>
					);
				})}
			</div>
		</section>
	);
}
