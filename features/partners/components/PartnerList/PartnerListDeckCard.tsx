// features/partners/components/PartnerList/PartnerListDeckCard.tsx
import Image from "next/image";
import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { PartnerListDeckCardActions } from "@/features/partners/components/PartnerList/PartnerListDeckCardActions";
import type { PartnerCardItem } from "@/features/partners/types";
import { calculateAgeFromBirthYear, formatKrw } from "@/features/partners/utils";
import type { PartnerRatingSummary } from "@/features/reviews/types";

// 사진 없을 때 쓰는 플레이스홀더 팔레트 — 카드 순서대로 순환
const PLACEHOLDER_STYLES = [
	{ background: "linear-gradient(160deg, #ffe8e1, #ffd0c2)", icon: "#f26b4a" },
	{ background: "linear-gradient(160deg, #d5f1ef, #aee3e0)", icon: "#2e9995" },
	{ background: "linear-gradient(160deg, #e4e4e7, #d4d4d8)", icon: "#71717a" },
];

type PartnerListDeckCardProps = {
	partner: PartnerCardItem;
	index: number;
	rating?: PartnerRatingSummary;
};

export function PartnerListDeckCard({
	partner,
	index,
	rating,
}: PartnerListDeckCardProps): JSX.Element {
	const placeholder = PLACEHOLDER_STYLES[index % PLACEHOLDER_STYLES.length];

	return (
		<article
			className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl"
			style={{ background: placeholder.background }}>
			<svg
				className="absolute bottom-0 left-1/2 -translate-x-1/2"
				width="220"
				height="220"
				viewBox="0 0 24 24"
				fill={placeholder.icon}
				opacity="0.28">
				<circle cx="12" cy="8.5" r="3.6" />
				<path d="M4.5 21c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7z" />
			</svg>
			{partner.photo_urls.length > 0 && (
				<Image
					src={partner.photo_urls[0]}
					alt={`${partner.nickname} 프로필 사진`}
					fill
					sizes="(max-width: 448px) 100vw, 408px"
					priority={index === 0}
					className="object-cover"
				/>
			)}
			{partner.isNew && (
				<Badge variant="accent" className="absolute top-4 left-4 font-bold">
					NEW
				</Badge>
			)}
			<PartnerListDeckCardActions partnerId={partner.profile_id} />
			<div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-5 pt-20 text-white">
				<div className="flex items-center gap-2">
					<span className="text-2xl font-bold tracking-tight">
						{partner.nickname}
						{partner.birth_year !== null && ` · ${calculateAgeFromBirthYear(partner.birth_year)}`}
					</span>
					<svg width="18" height="18" viewBox="0 0 24 24" aria-label="인증된 파트너">
						<circle cx="12" cy="12" r="10" fill="#2e9995" />
						<path
							d="M8.2 12.4l2.4 2.4 5-5"
							fill="none"
							stroke="#ffffff"
							strokeWidth="2.2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
				<p className="text-sm text-white/85">
					{partner.purpose_tags.length > 0 && (
						<span className="text-brand font-semibold">{partner.purpose_tags[0]} · </span>
					)}
					{[partner.region, ...partner.interests].join(" · ")}
				</p>
				<div className="flex items-center justify-between pt-1">
					<p className="text-lg font-bold tabular-nums">
						{formatKrw(partner.hourly_rate_krw)}
						<span className="text-sm font-normal text-white/75"> /시간</span>
					</p>
					{rating && (
						<span className="flex items-center gap-1 text-sm tabular-nums">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="#f79e3d">
								<path d="M12 17.3l-5.5 3 1.1-6.2-4.5-4.4 6.2-.9L12 3l2.7 5.8 6.2.9-4.5 4.4 1.1 6.2z" />
							</svg>
							{rating.average} ({rating.count})
						</span>
					)}
				</div>
			</div>
		</article>
	);
}
