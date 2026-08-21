// features/favorites/components/FavoriteActions.tsx
"use client";

import type { JSX } from "react";
import { useToggleBookmarkMutation, useToggleLikeMutation } from "@/features/favorites/mutations";
import { useFavoriteStateQuery, usePartnerLikeCountQuery } from "@/features/favorites/queries";
import { cn } from "@/utils/cn";

type FavoriteActionsProps = {
	partnerId: string;
};

// 파트너 상세의 좋아요(공개 호감, 개수 노출)·찜(비공개 보관) 버튼
export function FavoriteActions({ partnerId }: FavoriteActionsProps): JSX.Element {
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
		<div className="flex items-center gap-2">
			<button
				type="button"
				onClick={handleLikeClick}
				aria-label={isLiked ? "좋아요 취소" : "좋아요"}
				aria-pressed={isLiked}
				className={cn(
					"flex h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-transform active:scale-90",
					isLiked ? "bg-heart-subtle text-heart" : "bg-surface-alt text-sub",
				)}>
				<svg
					width="17"
					height="17"
					viewBox="0 0 24 24"
					fill={isLiked ? "currentColor" : "none"}
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round">
					<path d="M19.5 12.6L12 20l-7.5-7.4A5 5 0 1 1 12 6a5 5 0 1 1 7.5 6.6z" />
				</svg>
				<span className="tabular-nums">{likeCount ?? 0}</span>
			</button>
			<button
				type="button"
				onClick={handleBookmarkClick}
				aria-label={isBookmarked ? "찜 해제" : "찜하기"}
				aria-pressed={isBookmarked}
				className={cn(
					"flex size-10 items-center justify-center rounded-full transition-transform active:scale-90",
					isBookmarked ? "bg-secondary-50 text-trust" : "bg-surface-alt text-sub",
				)}>
				<svg
					width="17"
					height="17"
					viewBox="0 0 24 24"
					fill={isBookmarked ? "currentColor" : "none"}
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round">
					<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
				</svg>
			</button>
		</div>
	);
}
