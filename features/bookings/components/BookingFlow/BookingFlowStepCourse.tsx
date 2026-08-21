// features/bookings/components/BookingFlow/BookingFlowStepCourse.tsx
"use client";

import type { JSX } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/utils/cn";

// 공개 장소 화이트리스트 원칙 유지 — 밀실·숙박 성격 카테고리는 넣지 않는다
export const COURSE_CATEGORIES = [
	{ label: "카페", emoji: "☕" },
	{ label: "식사", emoji: "🍽️" },
	{ label: "영화", emoji: "🎬" },
	{ label: "전시", emoji: "🖼️" },
	{ label: "산책·공원", emoji: "🌳" },
	{ label: "만화카페", emoji: "📚" },
	{ label: "보드게임", emoji: "🎲" },
	{ label: "놀이공원", emoji: "🎡" },
	{ label: "공연", emoji: "🎤" },
	{ label: "쇼핑", emoji: "🛍️" },
	{ label: "배드민턴", emoji: "🏸" },
	{ label: "풋살", emoji: "⚽" },
	{ label: "볼링", emoji: "🎳" },
];

type BookingFlowStepCourseProps = {
	category: string | null;
	placeDetail: string;
	categoryError: boolean;
	onCategoryChange: (category: string) => void;
	onPlaceDetailChange: (placeDetail: string) => void;
};

export function BookingFlowStepCourse({
	category,
	placeDetail,
	categoryError,
	onCategoryChange,
	onPlaceDetailChange,
}: BookingFlowStepCourseProps): JSX.Element {
	return (
		<div className="flex flex-col gap-6">
			<section id="booking-course-category" className="flex flex-col gap-3">
				<div className="flex flex-col gap-1">
					<h2 className="text-[17px] font-semibold">
						어떤 데이트를 할까요? <span className="text-brand text-sm font-medium">(필수)</span>
					</h2>
					<p className="text-sub text-[13px]">하나를 골라주세요 — 장소 입력이 더 쉬워져요.</p>
				</div>
				<div className="grid grid-cols-2 gap-2">
					{COURSE_CATEGORIES.map(function (item) {
						const selected = category === item.label;
						return (
							<button
								key={item.label}
								type="button"
								onClick={function () {
									onCategoryChange(item.label);
								}}
								aria-pressed={selected}
								className={cn(
									"flex h-13 items-center gap-2.5 rounded-2xl border-2 px-4 text-left text-sm transition-colors",
									selected && "border-brand bg-brand-subtle text-body font-semibold",
									!selected && "border-line bg-surface text-body",
								)}>
								<span className="text-lg">{item.emoji}</span>
								<span className="flex-1">{item.label}</span>
								{selected && (
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-brand">
										<path d="M5 13l4 4 10-10" />
									</svg>
								)}
							</button>
						);
					})}
				</div>
				{categoryError && <p className="text-error-500 text-xs">데이트 카테고리를 골라주세요.</p>}
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-[17px] font-semibold">만남 장소</h2>
				<Input
					value={placeDetail}
					onChange={function (event) {
						onPlaceDetailChange(event.target.value);
					}}
					placeholder="예: 성수동 ○○카페"
					maxLength={50}
				/>
				<p className="bg-secondary-50 text-secondary-700 flex items-center gap-1.5 rounded-xl px-4 py-3 text-xs">
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" />
					</svg>
					안전을 위해 카페·전시·공원 등 공개 장소에서만 만날 수 있어요.
				</p>
				<p className="bg-surface-alt text-sub rounded-xl px-4 py-3 text-xs leading-relaxed">
					입장료·식사비 등 데이트 중 발생하는 비용은 예약한 고객이 부담해요. 파트너에게 지불하는
					시간제 요금과는 별도예요.
				</p>
			</section>
		</div>
	);
}
