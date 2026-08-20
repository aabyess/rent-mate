// features/partners/components/PartnerDetail/index.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { PartnerDetailActionBar } from "@/features/partners/components/PartnerDetail/PartnerDetailActionBar";
import { PartnerDetailAvailability } from "@/features/partners/components/PartnerDetail/PartnerDetailAvailability";
import { PartnerDetailMenu } from "@/features/partners/components/PartnerDetail/PartnerDetailMenu";
import { PartnerDetailPhotoCarousel } from "@/features/partners/components/PartnerDetail/PartnerDetailPhotoCarousel";
import { PartnerDetailPricing } from "@/features/partners/components/PartnerDetail/PartnerDetailPricing";
import { usePartnerDetailQuery } from "@/features/partners/queries";
import { calculateAgeFromBirthYear } from "@/features/partners/utils";
import { useMyBlocksQuery } from "@/features/safety/queries";
import { PartnerPostList } from "@/features/partnerPosts/components/PartnerPostList";
import { PartnerReviewList } from "@/features/reviews/components/PartnerReviewList";

const DATE_COURSES = [
	{
		label: "카페",
		icon: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round">
				<path d="M4 9h13v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
				<path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M7 4.5v2M11 4.5v2" />
			</svg>
		),
	},
	{
		label: "전시",
		icon: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round">
				<rect x="4" y="4" width="16" height="13" rx="1.5" />
				<path d="M9 21h6M12 17v4M8 12l2.5-3 2 2.2L15 8.5l2 3.5" />
			</svg>
		),
	},
	{
		label: "산책",
		icon: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round">
				<path d="M12 21s-6.5-5.4-6.5-10A6.5 6.5 0 0 1 12 4.5 6.5 6.5 0 0 1 18.5 11c0 4.6-6.5 10-6.5 10z" />
				<circle cx="12" cy="11" r="2.3" />
			</svg>
		),
	},
];

type PartnerDetailProps = {
	profileId: string;
};

export function PartnerDetail({ profileId }: PartnerDetailProps): JSX.Element {
	const router = useRouter();
	const { data: partner, isPending, isError } = usePartnerDetailQuery(profileId);
	const { data: blocks, isPending: isBlocksPending } = useMyBlocksQuery();

	function handleBackClick(): void {
		router.back();
	}

	if (isPending || isBlocksPending) {
		return (
			<div className="flex flex-col gap-5">
				<div className="bg-surface-alt h-[400px] animate-pulse" />
				<div className="flex flex-col gap-3 px-5">
					<div className="bg-surface-alt h-7 w-1/2 animate-pulse rounded" />
					<div className="bg-surface-alt h-4 w-full animate-pulse rounded" />
					<div className="bg-surface-alt h-4 w-2/3 animate-pulse rounded" />
				</div>
			</div>
		);
	}

	if (isError || !partner) {
		return (
			<div className="flex flex-col items-center gap-4 py-24">
				<p className="text-sub text-sm">파트너를 찾을 수 없어요.</p>
				<Link href="/" className="text-brand font-medium underline">
					홈으로 돌아가기
				</Link>
			</div>
		);
	}

	const isBlocked = (blocks ?? []).some(function (block) {
		return block.blocked_id === profileId;
	});
	if (isBlocked) {
		return (
			<div className="flex flex-col items-center gap-4 py-24">
				<p className="text-sub text-sm">차단한 파트너예요.</p>
				<Link href="/safety-center#blocks" className="text-brand font-medium underline">
					차단 목록에서 해제하기
				</Link>
			</div>
		);
	}

	return (
		<div className="pb-32">
			<div className="relative h-[400px] overflow-hidden">
				<PartnerDetailPhotoCarousel photoUrls={partner.photo_urls} nickname={partner.nickname} />
				<button
					type="button"
					onClick={handleBackClick}
					aria-label="뒤로 가기"
					className="absolute top-3.5 left-3.5 flex size-10 items-center justify-center rounded-full bg-white/90">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#18181b"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M15 5l-7 7 7 7" />
					</svg>
				</button>
				<div className="absolute top-3.5 right-3.5">
					<PartnerDetailMenu targetId={partner.profile_id} targetNickname={partner.nickname} />
				</div>
			</div>

			<div className="flex flex-col gap-7 px-5 py-5">
				<section className="flex flex-col gap-2.5">
					<div className="flex items-center gap-2">
						<h1 className="text-2xl font-bold">
							{partner.nickname}
							{partner.birth_year !== null && ` · ${calculateAgeFromBirthYear(partner.birth_year)}`}
						</h1>
						<Badge variant="trust">성인인증</Badge>
						<Badge variant="trust">실명인증</Badge>
					</div>
					<span className="text-sub flex items-center gap-1.5 text-[13px]">
						<svg
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
							strokeLinejoin="round">
							<path d="M12 21s-6.5-5.4-6.5-10A6.5 6.5 0 0 1 12 4.5 6.5 6.5 0 0 1 18.5 11c0 4.6-6.5 10-6.5 10z" />
							<circle cx="12" cy="11" r="2.3" />
						</svg>
						{partner.region}
						{(partner.height_cm !== null || partner.weight_kg !== null) && (
							<span className="tabular-nums">
								{" · "}
								{[
									partner.height_cm !== null ? `${partner.height_cm}cm` : null,
									partner.weight_kg !== null ? `${partner.weight_kg}kg` : null,
								]
									.filter(Boolean)
									.join(" · ")}
							</span>
						)}
					</span>
					<p className="text-[15px] leading-relaxed">{partner.bio}</p>
					{partner.purpose_tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{partner.purpose_tags.map(function (tag) {
								return (
									<span
										key={tag}
										className="bg-brand-subtle text-primary-700 rounded-full px-3 py-1.5 text-[13px] font-medium">
										{tag}
									</span>
								);
							})}
						</div>
					)}
					{partner.interests.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{partner.interests.map(function (interest) {
								return (
									<span
										key={interest}
										className="bg-surface-alt text-sub rounded-full px-3 py-1.5 text-[13px]">
										{interest}
									</span>
								);
							})}
						</div>
					)}
				</section>

				<PartnerDetailPricing hourlyRateKrw={partner.hourly_rate_krw} />

				<PartnerDetailAvailability availableWeekdays={partner.available_weekdays} />

				<section className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<h2 className="text-[17px] font-semibold">추천 데이트 코스</h2>
						<span className="text-secondary-700 flex items-center gap-1 text-xs">
							<svg
								width="13"
								height="13"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round">
								<path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" />
							</svg>
							공개 장소에서만 진행돼요
						</span>
					</div>
					<div className="flex gap-2.5">
						{DATE_COURSES.map(function (course) {
							return (
								<div
									key={course.label}
									className="bg-surface-alt text-sub flex grow flex-col items-center gap-2 rounded-2xl py-3.5">
									{course.icon}
									<span className="text-body text-[13px] font-medium">{course.label}</span>
								</div>
							);
						})}
					</div>
				</section>

				<section className="flex flex-col gap-3">
					<h2 className="text-[17px] font-semibold">소식</h2>
					<PartnerPostList partnerId={partner.profile_id} partnerNickname={partner.nickname} />
				</section>

				<PartnerReviewList partnerId={partner.profile_id} />
			</div>

			<PartnerDetailActionBar
				profileId={partner.profile_id}
				hourlyRateKrw={partner.hourly_rate_krw}
			/>
		</div>
	);
}
