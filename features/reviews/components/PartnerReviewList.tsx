// features/reviews/components/PartnerReviewList.tsx
"use client";

import { useState, type JSX } from "react";
import { ReviewStars } from "@/features/reviews/components/ReviewStars";
import { usePartnerReviewsQuery } from "@/features/reviews/queries";
import { calculateAverageRating, formatReviewDate } from "@/features/reviews/utils";
import { ReportDialog } from "@/features/safety/components/ReportDialog";

type PartnerReviewListProps = {
	partnerId: string;
};

export function PartnerReviewList({ partnerId }: PartnerReviewListProps): JSX.Element {
	const { data: reviews, isPending, isError } = usePartnerReviewsQuery(partnerId);
	const [reportTarget, setReportTarget] = useState<{ authorId: string; reviewId: string } | null>(
		null,
	);

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
								<div className="flex items-center gap-2.5">
									<span className="text-sub text-xs tabular-nums">
										{formatReviewDate(review.created_at)}
									</span>
									<button
										type="button"
										onClick={function () {
											setReportTarget({ authorId: review.author_id, reviewId: review.id });
										}}
										className="text-sub text-[11px] underline">
										신고
									</button>
								</div>
							</div>
							{review.timeliness_rating !== null &&
								review.manner_rating !== null &&
								review.safety_rating !== null &&
								review.would_meet_again_rating !== null && (
									<div className="text-sub flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
										<span>시간 약속 {review.timeliness_rating}</span>
										<span>매너 {review.manner_rating}</span>
										<span>안전 {review.safety_rating}</span>
										<span>재만남 {review.would_meet_again_rating}</span>
									</div>
								)}
							{review.content !== "" && (
								<p className="text-body text-sm leading-relaxed">{review.content}</p>
							)}
						</article>
					);
				})}
			</div>
			{reportTarget && (
				<ReportDialog
					onClose={function () {
						setReportTarget(null);
					}}
					targetId={reportTarget.authorId}
					targetNickname="후기 작성자"
					reasonContext={`후기 신고 ${reportTarget.reviewId}`}
				/>
			)}
		</section>
	);
}
