// features/partners/components/PartnerDetail/PartnerDetailAvailability.tsx
import type { JSX } from "react";
import { cn } from "@/utils/cn";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

type PartnerDetailAvailabilityProps = {
	availableWeekdays: number[];
};

export function PartnerDetailAvailability({
	availableWeekdays,
}: PartnerDetailAvailabilityProps): JSX.Element {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-[17px] font-semibold">가능 요일</h2>
			<div className="grid grid-cols-7 gap-1.5">
				{WEEKDAY_LABELS.map(function (label, weekday) {
					const isAvailable = availableWeekdays.includes(weekday);
					return (
						<div
							key={label}
							className={cn(
								"flex flex-col items-center gap-1.5 rounded-xl py-2.5",
								isAvailable && "bg-brand-subtle",
								!isAvailable && "bg-surface-alt",
							)}>
							<span
								className={cn(
									"text-xs",
									isAvailable && "text-primary-600 font-semibold",
									!isAvailable && "text-sub",
								)}>
								{label}
							</span>
							<span
								className={cn(
									"size-1.5 rounded-full",
									isAvailable && "bg-brand",
									!isAvailable && "bg-line",
								)}
							/>
						</div>
					);
				})}
			</div>
		</section>
	);
}
