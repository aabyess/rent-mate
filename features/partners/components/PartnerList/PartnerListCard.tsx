// features/partners/components/PartnerList/PartnerListCard.tsx
import Image from "next/image";
import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import type { PartnerCardItem } from "@/features/partners/types";
import { calculateAgeFromBirthYear, formatKrw } from "@/features/partners/utils";

// 사진 없을 때 쓰는 플레이스홀더 팔레트 — 카드 순서대로 순환
const PLACEHOLDER_STYLES = [
	{ background: "linear-gradient(160deg, #ffe8e1, #ffd0c2)", icon: "#f26b4a" },
	{ background: "linear-gradient(160deg, #d5f1ef, #aee3e0)", icon: "#2e9995" },
	{ background: "linear-gradient(160deg, #fef1dc, #ffd08a)", icon: "#dd7f1f" },
];

type PartnerListCardProps = {
	partner: PartnerCardItem;
	index: number;
};

export function PartnerListCard({ partner, index }: PartnerListCardProps): JSX.Element {
	const placeholder = PLACEHOLDER_STYLES[index % PLACEHOLDER_STYLES.length];

	return (
		<article className="flex flex-col gap-2">
			<div
				className="relative flex h-56 items-end justify-center overflow-hidden rounded-2xl"
				style={{ background: placeholder.background }}>
				<svg width="120" height="120" viewBox="0 0 24 24" fill={placeholder.icon} opacity="0.28">
					<circle cx="12" cy="8.5" r="3.6" />
					<path d="M4.5 21c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7z" />
				</svg>
				{partner.photo_urls.length > 0 && (
					<Image
						src={partner.photo_urls[0]}
						alt={`${partner.nickname} 프로필 사진`}
						fill
						sizes="(max-width: 448px) 50vw, 224px"
						className="object-cover"
					/>
				)}
				{partner.isNew && (
					<Badge variant="accent" className="absolute top-2.5 left-2.5 font-bold">
						NEW
					</Badge>
				)}
			</div>
			<div className="flex items-center gap-1.5">
				<span className="text-base font-semibold">
					{partner.nickname}
					{partner.birth_year !== null && ` · ${calculateAgeFromBirthYear(partner.birth_year)}`}
				</span>
				<svg width="16" height="16" viewBox="0 0 24 24" aria-label="인증된 파트너">
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
			{partner.interests.length > 0 && (
				<p className="text-sub text-xs">{partner.interests.join(" · ")}</p>
			)}
			<p className="text-[15px] font-bold tabular-nums">
				{formatKrw(partner.hourly_rate_krw)}
				<span className="text-sub text-xs font-normal"> /시간</span>
			</p>
		</article>
	);
}
