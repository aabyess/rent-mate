// features/partners/components/PartnerDetail/PartnerDetailQna.tsx
import type { JSX } from "react";
import { isQnaComplete, QNA_QUESTION_LABELS, type PartnerQna } from "@/features/partners/qna";

type PartnerDetailQnaProps = {
	qna: PartnerQna;
};

// 필수 문항이 다 채워졌을 때만 렌더 — 미완성 프로필은 빈 카드를 보이지 않는다
export function PartnerDetailQna({ qna }: PartnerDetailQnaProps): JSX.Element | null {
	if (!isQnaComplete(qna)) {
		return null;
	}

	const entries = [
		{ label: QNA_QUESTION_LABELS.firstImpression, value: qna.firstImpression },
		{ label: QNA_QUESTION_LABELS.hobbies, value: qna.hobbies.join(", ") },
		{ label: QNA_QUESTION_LABELS.genres, value: qna.genres.join(", ") },
		{ label: QNA_QUESTION_LABELS.topicAllNight, value: qna.topicAllNight },
		{ label: QNA_QUESTION_LABELS.courseCategories, value: qna.courseCategories.join(", ") },
		{ label: QNA_QUESTION_LABELS.smallHappiness, value: qna.smallHappiness },
	];
	if (qna.mbti) {
		entries.push({ label: QNA_QUESTION_LABELS.mbti, value: qna.mbti });
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
