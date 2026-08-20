// features/bookings/components/BookingDetail/BookingDetailReview.tsx
import type { JSX } from "react";
import { ReviewStars } from "@/features/reviews/components/ReviewStars";
import type { ReviewRow } from "@/features/reviews/types";
import { formatReviewDate } from "@/features/reviews/utils";

type BookingDetailReviewProps = {
	review: ReviewRow;
};

export function BookingDetailReview({ review }: BookingDetailReviewProps): JSX.Element {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-[17px] font-semibold">후기</h2>
			<div className="bg-surface-alt flex flex-col gap-2 rounded-2xl px-4 py-4">
				<div className="flex items-center justify-between">
					<ReviewStars rating={review.rating} size={16} />
					<span className="text-sub text-xs tabular-nums">
						{formatReviewDate(review.created_at)}
					</span>
				</div>
				{review.content && (
					<p className="text-body text-sm leading-relaxed break-words">{review.content}</p>
				)}
			</div>
		</section>
	);
}
