// features/shared/components/RegionPicker/index.tsx
"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, type JSX } from "react";
import { REGION_PROVINCES } from "@/constants/regions";
import { cn } from "@/utils/cn";

type RegionPickerProps = {
	/** 단일 선택은 [value], 다중 선택은 선택된 값 배열을 그대로 넘긴다 */
	selectedValues: string[];
	/** 단일 선택은 그대로 교체, 다중 선택은 토글 — 호출부가 선택 시맨틱을 결정한다 */
	onToggle: (region: string) => void;
};

// iOS 위젯이 눌린 자리에서 펼쳐지는 느낌 — 과한 바운스 없이 스냅감만
const SPRING_TRANSITION = { type: "spring" as const, stiffness: 300, damping: 30 };
const FADE_TRANSITION = { duration: 0.15 };

export function RegionPicker({ selectedValues, onToggle }: RegionPickerProps): JSX.Element {
	const shouldReduceMotion = useReducedMotion();
	const [expandedProvince, setExpandedProvince] = useState<string | null>(null);
	const expanded = REGION_PROVINCES.find(function (province) {
		return province.label === expandedProvince;
	});

	function handleProvinceTap(provinceLabel: string, hasDistricts: boolean): void {
		if (!hasDistricts) {
			onToggle(provinceLabel);
			return;
		}
		setExpandedProvince(provinceLabel);
	}

	function handleCollapse(): void {
		setExpandedProvince(null);
	}

	return (
		<AnimatePresence initial={false}>
			{!expanded ? (
				<motion.div
					key="grid"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={FADE_TRANSITION}
					className="grid grid-cols-3 gap-2">
					{REGION_PROVINCES.map(function (province) {
						const hasDistricts = province.districts.length > 0;
						const selectedCount = hasDistricts
							? province.districts.filter(function (district) {
									return selectedValues.includes(district);
								}).length
							: selectedValues.includes(province.label)
								? 1
								: 0;
						const isSelected = selectedCount > 0;
						return (
							<motion.button
								key={province.label}
								layoutId={shouldReduceMotion ? undefined : `region-province-${province.label}`}
								type="button"
								onClick={function () {
									handleProvinceTap(province.label, hasDistricts);
								}}
								className={cn(
									"flex h-14 flex-col items-center justify-center gap-0.5 rounded-2xl text-sm",
									isSelected && "bg-inverse text-inverse-fg font-semibold",
									!isSelected && "bg-surface-alt text-body",
								)}>
								<span>{province.label}</span>
								{hasDistricts && selectedCount > 0 && (
									<span className="text-[10px] opacity-70">{selectedCount}개 선택</span>
								)}
							</motion.button>
						);
					})}
				</motion.div>
			) : (
				<motion.div
					key="panel"
					layoutId={shouldReduceMotion ? undefined : `region-province-${expanded.label}`}
					initial={shouldReduceMotion ? { opacity: 0 } : false}
					animate={shouldReduceMotion ? { opacity: 1 } : undefined}
					exit={shouldReduceMotion ? { opacity: 0 } : undefined}
					transition={shouldReduceMotion ? FADE_TRANSITION : SPRING_TRANSITION}
					className="bg-inverse flex flex-col gap-3 rounded-2xl p-4">
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={handleCollapse}
							aria-label="시/도 목록으로 돌아가기"
							className="text-inverse-fg flex size-7 items-center justify-center rounded-full bg-white/15">
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round">
								<path d="M15 5l-7 7 7 7" />
							</svg>
						</button>
						<span className="text-inverse-fg font-semibold">{expanded.label}</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{expanded.districts.map(function (district) {
							const isSelected = selectedValues.includes(district);
							return (
								<button
									key={district}
									type="button"
									onClick={function () {
										onToggle(district);
									}}
									className={cn(
										"h-9 rounded-full px-3.5 text-sm transition-colors",
										isSelected && "bg-inverse-fg text-inverse font-semibold",
										!isSelected && "text-inverse-fg bg-white/15",
									)}>
									{district}
								</button>
							);
						})}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
