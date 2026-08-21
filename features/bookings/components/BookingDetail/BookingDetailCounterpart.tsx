// features/bookings/components/BookingDetail/BookingDetailCounterpart.tsx
import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import type { PartnerDetailItem } from "@/features/partners/types";

type BookingDetailCounterpartProps = {
	name: string;
	// 상대가 파트너일 때만 사진·상세 링크를 보여준다 (고객에게는 별도 공개 프로필이 없다)
	partnerProfile: PartnerDetailItem | null;
};

export function BookingDetailCounterpart({
	name,
	partnerProfile,
}: BookingDetailCounterpartProps): JSX.Element {
	const content = (
		<div className="bg-surface-alt flex items-center gap-3.5 rounded-2xl p-4">
			<div className="from-primary-100 to-primary-200 relative size-14 shrink-0 overflow-hidden rounded-full bg-gradient-to-br">
				{partnerProfile && partnerProfile.photo_urls.length > 0 ? (
					<Image
						src={partnerProfile.photo_urls[0]}
						alt={`${name} 프로필 사진`}
						fill
						sizes="56px"
						className="object-cover"
					/>
				) : (
					<svg
						className="absolute bottom-0 left-1/2 -translate-x-1/2"
						width="56"
						height="56"
						viewBox="0 0 24 24"
						fill="var(--color-primary-400)"
						opacity="0.4">
						<circle cx="12" cy="8.5" r="3.6" />
						<path d="M4.5 21c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7z" />
					</svg>
				)}
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-[15px] font-semibold">{name}</span>
				<div className="flex gap-1.5">
					<Badge variant="trust">성인인증</Badge>
					<Badge variant="trust">실명인증</Badge>
				</div>
			</div>
			{partnerProfile && (
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
			)}
		</div>
	);

	if (!partnerProfile) {
		return content;
	}

	return <Link href={`/partners/${partnerProfile.profile_id}`}>{content}</Link>;
}
