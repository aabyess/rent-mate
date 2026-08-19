// features/reviews/components/ReviewStars.tsx
"use client";

import type { JSX } from "react";
import { cn } from "@/utils/cn";

const STAR_VALUES = [1, 2, 3, 4, 5];
const STAR_PATH = "M12 17.3l-5.5 3 1.1-6.2-4.5-4.4 6.2-.9L12 3l2.7 5.8 6.2.9-4.5 4.4 1.1 6.2z";

type ReviewStarsProps = {
	rating: number;
	size?: number;
	onSelect?: (rating: number) => void;
};

export function ReviewStars({ rating, size = 14, onSelect }: ReviewStarsProps): JSX.Element {
	return (
		<div className="flex items-center gap-0.5">
			{STAR_VALUES.map(function (value) {
				const star = (
					<svg
						width={size}
						height={size}
						viewBox="0 0 24 24"
						fill="currentColor"
						className={cn(value <= rating ? "text-accent-500" : "text-line")}>
						<path d={STAR_PATH} />
					</svg>
				);
				if (!onSelect) {
					return <span key={value}>{star}</span>;
				}
				return (
					<button
						key={value}
						type="button"
						aria-label={`${value}점`}
						onClick={function () {
							onSelect(value);
						}}
						className="p-1">
						{star}
					</button>
				);
			})}
		</div>
	);
}
