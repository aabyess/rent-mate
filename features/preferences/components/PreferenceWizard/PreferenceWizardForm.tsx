// features/preferences/components/PreferenceWizard/PreferenceWizardForm.tsx
"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { REGIONS } from "@/constants/regions";
import { PURPOSE_TAGS } from "@/constants/purposeTags";
import { INTEREST_OPTIONS } from "@/features/partners/utils";
import {
	useSavePreferencesMutation,
	useSkipPreferencesMutation,
} from "@/features/preferences/mutations";
import type { CustomerPreferences } from "@/features/preferences/types";
import { cn } from "@/utils/cn";

type StepKey = "interests" | "regions" | "purposes";

const STEPS: { key: StepKey; title: string; caption: string; options: readonly string[] }[] = [
	{
		key: "interests",
		title: "어떤 데이트를 좋아하세요?",
		caption: "취향에 맞는 파트너를 먼저 보여드려요.",
		options: INTEREST_OPTIONS,
	},
	{
		key: "regions",
		title: "주로 어디서 만나고 싶으세요?",
		caption: "가까운 지역의 파트너를 앞쪽에 배치해요.",
		options: REGIONS,
	},
	{
		key: "purposes",
		title: "어떤 데이트가 필요하세요?",
		caption: "목적이 맞는 파트너와 이어드릴게요.",
		options: PURPOSE_TAGS,
	},
];

// 책장을 넘기듯 다음 페이지는 오른쪽에서 접혀 들어오고, 이전 페이지는 왼쪽으로 젖혀 나간다
const pageVariants = {
	initial: function (direction: number) {
		return { rotateY: direction > 0 ? 70 : -70, opacity: 0 };
	},
	animate: { rotateY: 0, opacity: 1 },
	exit: function (direction: number) {
		return { rotateY: direction > 0 ? -70 : 70, opacity: 0 };
	},
};

type PreferenceWizardFormProps = {
	isSignupFlow: boolean;
	initialPreferences: CustomerPreferences | null;
	onDone: () => void;
};

export function PreferenceWizardForm({
	isSignupFlow,
	initialPreferences,
	onDone,
}: PreferenceWizardFormProps): JSX.Element {
	const shouldReduceMotion = useReducedMotion();
	const savePreferencesMutation = useSavePreferencesMutation();
	const skipPreferencesMutation = useSkipPreferencesMutation();
	const [stepIndex, setStepIndex] = useState(0);
	const [direction, setDirection] = useState(1);
	const [selections, setSelections] = useState<Record<StepKey, string[]>>({
		interests: initialPreferences?.interests ?? [],
		regions: initialPreferences?.regions ?? [],
		purposes: initialPreferences?.purposes ?? [],
	});

	const step = STEPS[stepIndex];
	const isLastStep = stepIndex === STEPS.length - 1;
	const isMutating = savePreferencesMutation.isPending || skipPreferencesMutation.isPending;

	function handleToggleOption(option: string): void {
		setSelections(function (current) {
			const list = current[step.key];
			return {
				...current,
				[step.key]: list.includes(option)
					? list.filter(function (item) {
							return item !== option;
						})
					: [...list, option],
			};
		});
	}

	function handleConfirm(): void {
		if (!isLastStep) {
			setDirection(1);
			setStepIndex(stepIndex + 1);
			return;
		}
		savePreferencesMutation.mutate(selections, { onSuccess: onDone });
	}

	function handleBack(): void {
		if (stepIndex === 0) {
			return;
		}
		setDirection(-1);
		setStepIndex(stepIndex - 1);
	}

	function handleSkip(): void {
		// 이미 취향을 저장한 적이 있으면 덮어쓰지 않고 그냥 닫는다
		if (!isSignupFlow || (initialPreferences !== null && initialPreferences.skipped_at === null)) {
			onDone();
			return;
		}
		skipPreferencesMutation.mutate(undefined, { onSuccess: onDone });
	}

	return (
		<div className="flex w-full max-w-sm flex-col gap-5">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					{STEPS.map(function (item, index) {
						return (
							<span
								key={item.key}
								className={cn(
									"h-1.5 rounded-full transition-all duration-300",
									index === stepIndex ? "bg-brand w-6" : "bg-surface-alt w-1.5",
								)}
							/>
						);
					})}
				</div>
				<button
					type="button"
					onClick={handleSkip}
					disabled={isMutating}
					className="text-sub text-[13px] underline underline-offset-2">
					{isSignupFlow ? "나중에 하기" : "닫기"}
				</button>
			</div>

			<div style={{ perspective: 1200 }}>
				<AnimatePresence mode="wait" initial={false} custom={direction}>
					<motion.section
						key={step.key}
						custom={direction}
						variants={pageVariants}
						initial={shouldReduceMotion ? false : "initial"}
						animate="animate"
						exit={shouldReduceMotion ? undefined : "exit"}
						transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
						style={{ transformStyle: "preserve-3d" }}
						className="bg-surface flex min-h-80 flex-col gap-4 rounded-3xl p-6 shadow-sm">
						<div className="flex flex-col gap-1">
							<span className="text-sub text-xs tabular-nums">
								{stepIndex + 1} / {STEPS.length}
							</span>
							<h2 className="text-xl font-bold">{step.title}</h2>
							<p className="text-sub text-sm">{step.caption}</p>
						</div>
						<div className="flex flex-wrap gap-2">
							{step.options.map(function (option) {
								const selected = selections[step.key].includes(option);
								return (
									<button
										key={option}
										type="button"
										onClick={function () {
											handleToggleOption(option);
										}}
										className={cn(
											"h-10 rounded-full px-4 text-sm transition-colors",
											selected && "bg-inverse text-inverse-fg font-semibold",
											!selected && "bg-surface-alt text-body",
										)}>
										{option}
									</button>
								);
							})}
						</div>
					</motion.section>
				</AnimatePresence>
			</div>

			{savePreferencesMutation.isError && (
				<p className="text-error-500 text-sm">{savePreferencesMutation.error.message}</p>
			)}

			<div className="flex gap-2">
				{stepIndex > 0 && (
					<Button variant="outline" onClick={handleBack} disabled={isMutating} className="w-28">
						이전
					</Button>
				)}
				<Button fullWidth onClick={handleConfirm} disabled={isMutating}>
					{isLastStep ? (savePreferencesMutation.isPending ? "저장 중..." : "완료") : "확인"}
				</Button>
			</div>
		</div>
	);
}
