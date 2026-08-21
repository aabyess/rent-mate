// features/partners/components/PartnerQnaFields.tsx
"use client";

import type { ChangeEvent, JSX } from "react";
import { Input } from "@/components/ui/Input";
import {
	MBTI_OPTIONS,
	QNA_COURSE_CATEGORY_OPTIONS,
	QNA_GENRE_OPTIONS,
	QNA_HOBBY_OPTIONS,
	QNA_QUESTION_LABELS,
	type PartnerQna,
} from "@/features/partners/qna";
import { cn } from "@/utils/cn";

type ShortAnswerKey = "firstImpression" | "topicAllNight" | "smallHappiness";
type MultiSelectKey = "hobbies" | "genres" | "courseCategories";

type PartnerQnaFieldsProps = {
	qna: PartnerQna;
	onChange: (qna: PartnerQna) => void;
	fieldError: { id: string; message: string } | null;
};

function toggleInArray(list: string[], value: string, max: number): string[] {
	if (list.includes(value)) {
		return list.filter(function (item) {
			return item !== value;
		});
	}
	if (list.length >= max) {
		return list;
	}
	return [...list, value];
}

export function PartnerQnaFields({
	qna,
	onChange,
	fieldError,
}: PartnerQnaFieldsProps): JSX.Element {
	function handleShortAnswerChange(
		key: ShortAnswerKey,
		event: ChangeEvent<HTMLInputElement>,
	): void {
		onChange({ ...qna, [key]: event.target.value });
	}

	function handleMultiToggle(key: MultiSelectKey, value: string): void {
		onChange({ ...qna, [key]: toggleInArray(qna[key], value, 2) });
	}

	function handleMbtiSelect(value: string): void {
		onChange({ ...qna, mbti: qna.mbti === value ? null : value });
	}

	return (
		<div className="flex flex-col gap-6">
			<section id="qna-firstImpression" className="flex flex-col gap-2">
				<label htmlFor="qna-firstImpression-input" className="text-sm font-medium">
					{QNA_QUESTION_LABELS.firstImpression}
				</label>
				<Input
					id="qna-firstImpression-input"
					value={qna.firstImpression}
					onChange={function (event) {
						handleShortAnswerChange("firstImpression", event);
					}}
					placeholder="20자 이내로 적어주세요"
					maxLength={20}
				/>
				{fieldError?.id === "qna-firstImpression" && (
					<p className="text-error-500 text-xs">{fieldError.message}</p>
				)}
			</section>

			<section id="qna-hobbies" className="flex flex-col gap-2">
				<span className="text-sm font-medium">{QNA_QUESTION_LABELS.hobbies} (최대 2개)</span>
				<div className="flex flex-wrap gap-2">
					{QNA_HOBBY_OPTIONS.map(function (option) {
						const selected = qna.hobbies.includes(option);
						return (
							<button
								key={option}
								type="button"
								onClick={function () {
									handleMultiToggle("hobbies", option);
								}}
								className={cn(
									"h-10 rounded-full px-4 text-sm",
									selected && "bg-inverse text-inverse-fg font-semibold",
									!selected && "bg-surface-alt text-body",
								)}>
								{option}
							</button>
						);
					})}
				</div>
				{fieldError?.id === "qna-hobbies" && (
					<p className="text-error-500 text-xs">{fieldError.message}</p>
				)}
			</section>

			<section id="qna-genres" className="flex flex-col gap-2">
				<span className="text-sm font-medium">{QNA_QUESTION_LABELS.genres} (최대 2개)</span>
				<div className="flex flex-wrap gap-2">
					{QNA_GENRE_OPTIONS.map(function (option) {
						const selected = qna.genres.includes(option);
						return (
							<button
								key={option}
								type="button"
								onClick={function () {
									handleMultiToggle("genres", option);
								}}
								className={cn(
									"h-10 rounded-full px-4 text-sm",
									selected && "bg-inverse text-inverse-fg font-semibold",
									!selected && "bg-surface-alt text-body",
								)}>
								{option}
							</button>
						);
					})}
				</div>
				{fieldError?.id === "qna-genres" && (
					<p className="text-error-500 text-xs">{fieldError.message}</p>
				)}
			</section>

			<section id="qna-topicAllNight" className="flex flex-col gap-2">
				<label htmlFor="qna-topicAllNight-input" className="text-sm font-medium">
					{QNA_QUESTION_LABELS.topicAllNight}
				</label>
				<Input
					id="qna-topicAllNight-input"
					value={qna.topicAllNight}
					onChange={function (event) {
						handleShortAnswerChange("topicAllNight", event);
					}}
					placeholder="40자 이내로 적어주세요"
					maxLength={40}
				/>
				{fieldError?.id === "qna-topicAllNight" && (
					<p className="text-error-500 text-xs">{fieldError.message}</p>
				)}
			</section>

			<section id="qna-courseCategories" className="flex flex-col gap-2">
				<span className="text-sm font-medium">
					{QNA_QUESTION_LABELS.courseCategories} (최대 2개)
				</span>
				<div className="flex flex-wrap gap-2">
					{QNA_COURSE_CATEGORY_OPTIONS.map(function (option) {
						const selected = qna.courseCategories.includes(option);
						return (
							<button
								key={option}
								type="button"
								onClick={function () {
									handleMultiToggle("courseCategories", option);
								}}
								className={cn(
									"h-10 rounded-full px-4 text-sm",
									selected && "bg-inverse text-inverse-fg font-semibold",
									!selected && "bg-surface-alt text-body",
								)}>
								{option}
							</button>
						);
					})}
				</div>
				{fieldError?.id === "qna-courseCategories" && (
					<p className="text-error-500 text-xs">{fieldError.message}</p>
				)}
			</section>

			<section id="qna-smallHappiness" className="flex flex-col gap-2">
				<label htmlFor="qna-smallHappiness-input" className="text-sm font-medium">
					{QNA_QUESTION_LABELS.smallHappiness}
				</label>
				<Input
					id="qna-smallHappiness-input"
					value={qna.smallHappiness}
					onChange={function (event) {
						handleShortAnswerChange("smallHappiness", event);
					}}
					placeholder="40자 이내로 적어주세요"
					maxLength={40}
				/>
				{fieldError?.id === "qna-smallHappiness" && (
					<p className="text-error-500 text-xs">{fieldError.message}</p>
				)}
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">
					{QNA_QUESTION_LABELS.mbti} <span className="text-sub font-normal">(선택)</span>
				</span>
				<div className="grid grid-cols-4 gap-2">
					{MBTI_OPTIONS.map(function (option) {
						const selected = qna.mbti === option;
						return (
							<button
								key={option}
								type="button"
								onClick={function () {
									handleMbtiSelect(option);
								}}
								className={cn(
									"flex h-10 items-center justify-center rounded-xl text-sm",
									selected && "bg-brand-subtle text-primary-600 font-semibold",
									!selected && "bg-surface-alt text-sub",
								)}>
								{option}
							</button>
						);
					})}
				</div>
			</section>
		</div>
	);
}
