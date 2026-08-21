// features/favorites/components/PartnerLikerList.tsx
"use client";

import type { JSX } from "react";
import { usePartnerLikersQuery } from "@/features/favorites/queries";

function formatLikedDate(likedAt: string): string {
	const date = new Date(likedAt);
	return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// 파트너 본인 전용 — 내 프로필에 좋아요를 누른 고객 목록
export function PartnerLikerList(): JSX.Element {
	const { data: likers, isPending, isError } = usePartnerLikersQuery();

	if (isPending) {
		return (
			<div className="flex flex-col gap-2.5">
				<div className="bg-surface-alt h-14 animate-pulse rounded-2xl" />
				<div className="bg-surface-alt h-14 animate-pulse rounded-2xl" />
			</div>
		);
	}

	if (isError) {
		return <p className="text-sub py-16 text-center text-sm">목록을 불러오지 못했어요.</p>;
	}

	if (!likers || likers.length === 0) {
		return (
			<p className="text-sub py-16 text-center text-sm">
				아직 좋아요를 누른 고객이 없어요.
				<br />
				블로그에 일기를 올리면 프로필 방문이 늘어나요!
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-2.5">
			{likers.map(function (liker, index) {
				return (
					<div
						key={`${liker.liker_name}-${liker.liked_at}-${index}`}
						className="bg-surface flex items-center gap-3 rounded-2xl px-4 py-3.5">
						<span className="bg-brand-subtle flex size-10 shrink-0 items-center justify-center rounded-full">
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="#f26b4a"
								stroke="#f26b4a"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round">
								<path d="M19.5 12.6L12 20l-7.5-7.4A5 5 0 1 1 12 6a5 5 0 1 1 7.5 6.6z" />
							</svg>
						</span>
						<span className="text-[15px] font-medium">{liker.liker_name}</span>
						<span className="text-sub ml-auto text-xs tabular-nums">
							{formatLikedDate(liker.liked_at)}
						</span>
					</div>
				);
			})}
		</div>
	);
}
