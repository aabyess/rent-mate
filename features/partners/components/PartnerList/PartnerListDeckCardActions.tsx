// features/partners/components/PartnerList/PartnerListDeckCardActions.tsx
"use client";

import type { JSX } from "react";
import { useToggleBookmarkMutation, useToggleLikeMutation } from "@/features/favorites/mutations";
import { useFavoriteStateQuery, usePartnerLikeCountQuery } from "@/features/favorites/queries";

type PartnerListDeckCardActionsProps = {
	partnerId: string;
};

// 덱 카드 우상단 오버레이 좋아요·찜 — data-deck-action으로 카드 탭(프로필 이동)과 분리된다
export function PartnerListDeckCardActions({
	partnerId,
}: PartnerListDeckCardActionsProps): JSX.Element {
	const { data: favoriteState } = useFavoriteStateQuery(partnerId);
	const { data: likeCount } = usePartnerLikeCountQuery(partnerId);
	const toggleLikeMutation = useToggleLikeMutation();
	const toggleBookmarkMutation = useToggleBookmarkMutation();

	const isLiked = favoriteState?.isLiked ?? false;
	const isBookmarked = favoriteState?.isBookmarked ?? false;

	function handleLikeClick(): void {
		if (toggleLikeMutation.isPending || !favoriteState) {
			return;
		}
		toggleLikeMutation.mutate({ partnerId, isOn: isLiked });
	}

	function handleBookmarkClick(): void {
		if (toggleBookmarkMutation.isPending || !favoriteState) {
			return;
		}
		toggleBookmarkMutation.mutate({ partnerId, isOn: isBookmarked });
	}

	return (
		<div data-deck-action className="absolute top-3.5 right-3.5 flex flex-col items-center gap-2">
			<button
				type="button"
				onClick={handleLikeClick}
				aria-label={isLiked ? "좋아요 취소" : "좋아요"}
				aria-pressed={isLiked}
				className="flex size-11 flex-col items-center justify-center rounded-full bg-black/35 backdrop-blur-sm transition-transform active:scale-90">
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill={isLiked ? "#f26b4a" : "none"}
					stroke={isLiked ? "#f26b4a" : "#ffffff"}
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round">
					<path d="M19.5 12.6L12 20l-7.5-7.4A5 5 0 1 1 12 6a5 5 0 1 1 7.5 6.6z" />
				</svg>
				<span className="text-[10px] font-semibold text-white tabular-nums">{likeCount ?? 0}</span>
			</button>
			<button
				type="button"
				onClick={handleBookmarkClick}
				aria-label={isBookmarked ? "찜 해제" : "찜하기"}
				aria-pressed={isBookmarked}
				className="flex size-11 items-center justify-center rounded-full bg-black/35 backdrop-blur-sm transition-transform active:scale-90">
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill={isBookmarked ? "#4bb3b0" : "none"}
					stroke={isBookmarked ? "#4bb3b0" : "#ffffff"}
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round">
					<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
				</svg>
			</button>
		</div>
	);
}
