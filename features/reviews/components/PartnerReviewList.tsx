// features/reviews/components/PartnerReviewList.tsx
"use client";

import type { JSX } from "react";
import { ReviewStars } from "@/features/reviews/components/ReviewStars";
import { usePartnerReviewsQuery } from "@/features/reviews/queries";
import { calculateAverageRating, formatReviewDate } from "@/features/reviews/utils";

type PartnerReviewListProps = {
	partnerId: string;
};

export function PartnerReviewList({ partnerId }: PartnerReviewListProps): JSX.Element {
	const { data: reviews, isPending, isError } = usePartnerReviewsQuery(partnerId);

	if (isPending) {
		return (
			<section className="flex flex-col gap-3">
				<h2 className="text-[17px] font-semibold">후기</h2>
				<div className="bg-surface-alt h-24 animate-pulse rounded-2xl" />
			</section>
		);
	}

	if (isError) {
		return (
			<section className="flex flex-col gap-3">
				<h2 className="text-[17px] font-semibold">후기</h2>
				<p className="text-sub py-4 text-center text-sm">후기를 불러오지 못했어요.</p>
			</section>
		);
	}

	if (reviews.length === 0) {
		return (
			<section className="flex flex-col gap-3">
				<h2 className="text-[17px] font-semibold">후기</h2>
				<p className="bg-surface-alt text-sub rounded-2xl px-4 py-8 text-center text-sm">
					아직 후기가 없어요. 첫 데이트 후 후기를 남겨보세요.
				</p>
			</section>
		);
	}

	const averageRating = calculateAverageRating(
		reviews.map(function (review) {
			return review.rating;
		}),
	);

	return (
		<section className="flex flex-col gap-3">
			<div className="flex items-baseline gap-2">
				<h2 className="text-[17px] font-semibold">후기</h2>
				<span className="text-[15px] font-bold tabular-nums">{averageRating}</span>
				<span className="text-sub text-sm">후기 {reviews.length}개</span>
			</div>
			<div className="flex flex-col gap-2.5">
				{reviews.map(function (review) {
					return (
						<article key={review.id} className="bg-surface-alt flex flex-col gap-2 rounded-2xl p-4">
							<div className="flex items-center justify-between">
								<ReviewStars rating={review.rating} />
								<span className="text-sub text-xs tabular-nums">
									{formatReviewDate(review.created_at)}
								</span>
							</div>
							{review.content !== "" && (
								<p className="text-body text-sm leading-relaxed">{review.content}</p>
							)}
						</article>
					);
				})}
			</div>
		</section>
	);
}
