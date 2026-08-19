// features/bookings/components/BookingFlow/BookingFlowStepCourse.tsx
"use client";

import type { JSX } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/utils/cn";

export const COURSE_CATEGORIES = ["카페", "전시", "산책", "맛집", "영화"];

type BookingFlowStepCourseProps = {
	category: string | null;
	placeDetail: string;
	onCategoryChange: (category: string) => void;
	onPlaceDetailChange: (placeDetail: string) => void;
};

export function BookingFlowStepCourse({
	category,
	placeDetail,
	onCategoryChange,
	onPlaceDetailChange,
}: BookingFlowStepCourseProps): JSX.Element {
	return (
		<div className="flex flex-col gap-6">
			<section className="flex flex-col gap-3">
				<h2 className="text-[17px] font-semibold">어떤 데이트를 할까요?</h2>
				<div className="flex flex-wrap gap-2">
					{COURSE_CATEGORIES.map(function (item) {
						const selected = category === item;
						return (
							<button
								key={item}
								type="button"
								onClick={function () {
									onCategoryChange(item);
								}}
								className={cn(
									"h-10 rounded-full px-4 text-sm",
									selected && "bg-neutral-900 font-semibold text-white",
									!selected && "bg-surface-alt text-body",
								)}>
								{item}
							</button>
						);
					})}
				</div>
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
			</section>
		</div>
	);
}
