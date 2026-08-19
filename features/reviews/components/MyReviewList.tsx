// features/reviews/components/MyReviewList.tsx
"use client";

import Link from "next/link";
import type { JSX } from "react";
import { ReviewStars } from "@/features/reviews/components/ReviewStars";
import { useMyReviewsQuery } from "@/features/reviews/queries";
import { formatReviewDate } from "@/features/reviews/utils";

export function MyReviewList(): JSX.Element {
	const { data: reviews, isPending, isError } = useMyReviewsQuery();

	if (isPending) {
		return (
			<div className="flex flex-col gap-3">
				{Array.from({ length: 3 }, function (_, index) {
					return <div key={index} className="bg-surface-alt h-28 animate-pulse rounded-2xl" />;
				})}
			</div>
		);
	}

	if (isError) {
		return <p className="text-sub py-16 text-center text-sm">후기를 불러오지 못했어요.</p>;
	}

	if (reviews.length === 0) {
		return (
			<div className="flex flex-col items-center gap-3 py-16">
				<p className="text-sub text-sm">아직 작성한 후기가 없어요.</p>
				<Link href="/bookings" className="text-brand text-sm font-medium underline">
					예약 내역 보기
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{reviews.map(function (review) {
				return (
					<article key={review.id} className="bg-surface-alt flex flex-col gap-2 rounded-2xl p-4">
						<div className="flex items-center justify-between">
							<span className="text-base font-semibold">{review.partnerNickname}</span>
							<ReviewStars rating={review.rating} />
						</div>
						<p className="text-body text-sm leading-relaxed break-words">{review.content}</p>
						<span className="text-sub text-xs">{formatReviewDate(review.created_at)}</span>
					</article>
				);
			})}
		</div>
	);
}
