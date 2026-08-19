// features/bookings/components/BookingDetail/BookingDetailStatusSteps.tsx
import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import type { BookingStatus } from "@/features/bookings/types";
import { cn } from "@/utils/cn";

const STEPS: { status: BookingStatus; label: string }[] = [
	{ status: "requested", label: "요청" },
	{ status: "accepted", label: "확정" },
	{ status: "completed", label: "완료" },
];

type BookingDetailStatusStepsProps = {
	status: BookingStatus;
};

export function BookingDetailStatusSteps({ status }: BookingDetailStatusStepsProps): JSX.Element {
	if (status === "rejected") {
		return (
			<div className="bg-surface-alt flex items-center justify-center rounded-2xl py-4">
				<Badge variant="error">거절된 예약이에요</Badge>
			</div>
		);
	}
	if (status === "canceled") {
		return (
			<div className="bg-surface-alt flex items-center justify-center rounded-2xl py-4">
				<Badge variant="neutral">취소된 예약이에요</Badge>
			</div>
		);
	}

	const currentIndex = STEPS.findIndex(function (step) {
		return step.status === status;
	});

	return (
		<div className="bg-surface-alt flex items-center rounded-2xl px-5 py-4">
			{STEPS.map(function (step, index) {
				const isDone = index <= currentIndex;
				return (
					<div key={step.status} className="flex grow items-center gap-1.5 last:grow-0">
						<div className="flex flex-col items-center gap-1.5">
							<span
								className={cn(
									"flex size-7 items-center justify-center rounded-full text-xs font-bold",
									isDone && "bg-brand text-white",
									!isDone && "bg-surface text-neutral-400",
								)}>
								{index + 1}
							</span>
							<span
								className={cn(
									"text-[11px]",
									isDone && "text-body font-semibold",
									!isDone && "text-sub",
								)}>
								{step.label}
							</span>
						</div>
						{index < STEPS.length - 1 && (
							<span
								className={cn(
									"mb-4 h-0.5 grow rounded-full",
									index < currentIndex ? "bg-brand" : "bg-line",
								)}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}
