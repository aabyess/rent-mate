// features/sportsMate/components/SportsMatePostForm/index.tsx
"use client";

import { useState, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { REGIONS } from "@/constants/regions";
import {
	GENDER_MODE_OPTIONS,
	SPORTS_MATE_COMMENT_MAX_LENGTH,
	SPORT_OPTIONS,
	TIME_SLOT_OPTIONS,
} from "@/features/sportsMate/constants";
import type {
	SportsMateGenderMode,
	SportsMatePostInput,
	SportsMateTimeSlot,
} from "@/features/sportsMate/types";
import { findBannedPhrase } from "@/utils/bannedPhrases";
import { cn } from "@/utils/cn";

type SportsMatePostFormProps = {
	initialValues?: SportsMatePostInput;
	isSubmitting: boolean;
	submitLabel: string;
	errorMessage?: string | null;
	onSubmit: (input: SportsMatePostInput) => void;
};

const TODAY = new Date().toISOString().slice(0, 10);

export function SportsMatePostForm({
	initialValues,
	isSubmitting,
	submitLabel,
	errorMessage = null,
	onSubmit,
}: SportsMatePostFormProps): JSX.Element {
	const [sport, setSport] = useState<string | null>(initialValues?.sport ?? null);
	const [region, setRegion] = useState<string | null>(initialValues?.region ?? null);
	const [preferredDate, setPreferredDate] = useState(initialValues?.preferredDate ?? "");
	const [timeSlot, setTimeSlot] = useState<SportsMateTimeSlot | null>(
		initialValues?.timeSlot ?? null,
	);
	const [genderMode, setGenderMode] = useState<SportsMateGenderMode | null>(
		initialValues?.genderMode ?? null,
	);
	const [comment, setComment] = useState(initialValues?.comment ?? "");
	const [bannedPhrase, setBannedPhrase] = useState<string | null>(null);

	const isValid =
		sport !== null &&
		region !== null &&
		preferredDate !== "" &&
		timeSlot !== null &&
		genderMode !== null;

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		if (!sport || !region || !preferredDate || !timeSlot || !genderMode) {
			return;
		}
		const banned = findBannedPhrase(comment);
		if (banned !== null) {
			setBannedPhrase(banned);
			return;
		}
		setBannedPhrase(null);
		onSubmit({
			sport,
			region,
			preferredDate,
			timeSlot,
			genderMode,
			comment: comment.trim(),
		});
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-5">
			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">종목</span>
				<div className="flex flex-wrap gap-2">
					{SPORT_OPTIONS.map(function (option) {
						const selected = sport === option;
						return (
							<button
								key={option}
								type="button"
								onClick={function () {
									setSport(option);
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
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">지역</span>
				<div className="flex flex-wrap gap-2">
					{REGIONS.map(function (option) {
						const selected = region === option;
						return (
							<button
								key={option}
								type="button"
								onClick={function () {
									setRegion(option);
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
			</section>

			<section className="flex flex-col gap-2">
				<label htmlFor="sports-mate-date" className="text-sm font-medium">
					희망 날짜
				</label>
				<input
					id="sports-mate-date"
					type="date"
					value={preferredDate}
					min={TODAY}
					onChange={function (event) {
						setPreferredDate(event.target.value);
					}}
					required
					className="bg-surface-alt text-body h-12 w-full rounded-xl px-4 text-[15px] focus:outline-none"
				/>
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">희망 시간대</span>
				<div className="flex flex-wrap gap-2">
					{TIME_SLOT_OPTIONS.map(function (option) {
						const selected = timeSlot === option.value;
						return (
							<button
								key={option.value}
								type="button"
								onClick={function () {
									setTimeSlot(option.value);
								}}
								className={cn(
									"h-10 rounded-full px-4 text-sm",
									selected && "bg-inverse text-inverse-fg font-semibold",
									!selected && "bg-surface-alt text-body",
								)}>
								{option.label}
							</button>
						);
					})}
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">참여 가능 성별</span>
				<div className="flex gap-2">
					{GENDER_MODE_OPTIONS.map(function (option) {
						const selected = genderMode === option.value;
						return (
							<button
								key={option.value}
								type="button"
								onClick={function () {
									setGenderMode(option.value);
								}}
								className={cn(
									"h-11 flex-1 rounded-xl text-sm",
									selected && "bg-inverse text-inverse-fg font-semibold",
									!selected && "bg-surface-alt text-body",
								)}>
								{option.label}
							</button>
						);
					})}
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<label htmlFor="sports-mate-comment" className="text-sm font-medium">
					한마디 (선택)
				</label>
				<textarea
					id="sports-mate-comment"
					value={comment}
					onChange={function (event) {
						setComment(event.target.value);
					}}
					maxLength={SPORTS_MATE_COMMENT_MAX_LENGTH}
					rows={3}
					placeholder="같이 운동할 메이트에게 한마디 남겨주세요"
					className="bg-surface-alt text-body placeholder:text-sub w-full resize-none rounded-xl p-4 text-[15px] focus:outline-none"
				/>
				{bannedPhrase !== null && (
					<p className="text-error-500 text-sm">
						&lsquo;{bannedPhrase}&rsquo; 표현은 사용할 수 없어요.
					</p>
				)}
			</section>

			{errorMessage !== null && <p className="text-error-500 text-sm">{errorMessage}</p>}

			<Button type="submit" fullWidth disabled={!isValid} isLoading={isSubmitting}>
				{isSubmitting ? "저장 중..." : submitLabel}
			</Button>
		</form>
	);
}
