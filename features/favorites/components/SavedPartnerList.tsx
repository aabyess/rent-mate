// features/favorites/components/SavedPartnerList.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";
import { useMyBookmarkedPartnersQuery } from "@/features/favorites/queries";
import { formatKrw } from "@/features/partners/utils";

export function SavedPartnerList(): JSX.Element {
	const { data: partners, isPending, isError } = useMyBookmarkedPartnersQuery();

	if (isPending) {
		return (
			<div className="flex flex-col gap-3">
				<div className="bg-surface-alt h-20 animate-pulse rounded-2xl" />
				<div className="bg-surface-alt h-20 animate-pulse rounded-2xl" />
			</div>
		);
	}

	if (isError) {
		return <p className="text-sub py-16 text-center text-sm">찜 목록을 불러오지 못했어요.</p>;
	}

	if (!partners || partners.length === 0) {
		return (
			<div className="flex flex-col items-center gap-4 py-24">
				<p className="text-sub text-sm">아직 찜한 파트너가 없어요.</p>
				<Link href="/" className="text-brand font-medium underline">
					파트너 둘러보기
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{partners.map(function (partner) {
				return (
					<Link
						key={partner.profile_id}
						href={`/partners/${partner.profile_id}`}
						className="bg-surface flex items-center gap-3.5 rounded-2xl p-3.5">
						<div className="bg-surface-alt relative size-16 shrink-0 overflow-hidden rounded-xl">
							{partner.photo_urls.length > 0 && (
								<Image
									src={partner.photo_urls[0]}
									alt={`${partner.nickname} 프로필 사진`}
									fill
									sizes="64px"
									className="object-cover"
								/>
							)}
						</div>
						<div className="flex min-w-0 flex-col gap-0.5">
							<span className="text-[15px] font-semibold">{partner.nickname}</span>
							<span className="text-sub truncate text-[13px]">
								{[partner.region, ...partner.purpose_tags].join(" · ")}
							</span>
							<span className="text-sm font-bold tabular-nums">
								{formatKrw(partner.hourly_rate_krw)}
								<span className="text-sub text-xs font-normal"> /시간</span>
							</span>
						</div>
						<svg
							className="text-sub ml-auto shrink-0"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<path d="M9 5l7 7-7 7" />
						</svg>
					</Link>
				);
			})}
		</div>
	);
}
