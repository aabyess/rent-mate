// features/admin/components/AdminDashboard/AdminDashboardPartnerSectionCard.tsx
"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import Image from "next/image";
import type { JSX } from "react";
import { Button } from "@/components/ui/Button";
import type { PendingPartnerItem } from "@/features/admin/types";
import { calculateAgeFromBirthYear, formatKrw } from "@/features/partners/utils";

const GENDER_LABELS: Record<"male" | "female", string> = {
	male: "남성",
	female: "여성",
};

type AdminDashboardPartnerSectionCardProps = {
	partner: PendingPartnerItem;
	isMutating: boolean;
	onApprove: () => void;
	onReject: () => void;
};

export function AdminDashboardPartnerSectionCard({
	partner,
	isMutating,
	onApprove,
	onReject,
}: AdminDashboardPartnerSectionCardProps): JSX.Element {
	return (
		<Disclosure as="article" className="bg-surface-alt rounded-2xl">
			<DisclosureButton className="group flex w-full items-center justify-between gap-3 p-4 text-left">
				<div className="flex flex-col gap-1">
					<span className="text-base font-semibold">
						{partner.nickname}
						<span className="text-sub text-sm font-normal"> · 실명 {partner.realName}</span>
					</span>
					<span className="text-sub text-xs">
						{GENDER_LABELS[partner.gender]}
						{partner.birth_year !== null && ` · ${calculateAgeFromBirthYear(partner.birth_year)}세`}
						{" · "}
						{partner.region}
					</span>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					<span className="text-[15px] font-bold tabular-nums">
						{formatKrw(partner.hourly_rate_krw)}
						<span className="text-sub text-xs font-normal"> /시간</span>
					</span>
					<svg
						className="text-sub shrink-0 transition-transform group-data-open:rotate-180"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M6 9l6 6 6-6" />
					</svg>
				</div>
			</DisclosureButton>

			<DisclosurePanel className="flex flex-col gap-4 px-4 pb-4">
				{partner.photo_urls.length > 0 ? (
					<div className="-mx-4 flex scrollbar-none gap-2 overflow-x-auto px-4">
						{partner.photo_urls.map(function (url, index) {
							return (
								<div
									key={url}
									className="bg-surface relative size-24 shrink-0 overflow-hidden rounded-xl">
									<Image
										src={url}
										alt={`${partner.nickname} 사진 ${index + 1}`}
										fill
										sizes="96px"
										className="object-cover"
									/>
								</div>
							);
						})}
					</div>
				) : (
					<p className="text-error-500 text-xs font-medium">사진이 등록되지 않았어요.</p>
				)}

				{partner.purpose_tags.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{partner.purpose_tags.map(function (tag) {
							return (
								<span
									key={tag}
									className="bg-brand-subtle text-primary-700 rounded-full px-2.5 py-1 text-xs font-medium">
									{tag}
								</span>
							);
						})}
					</div>
				)}
				{partner.interests.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{partner.interests.map(function (interest) {
							return (
								<span
									key={interest}
									className="bg-surface text-sub rounded-full px-2.5 py-1 text-xs">
									{interest}
								</span>
							);
						})}
					</div>
				)}

				<p className="text-body text-sm leading-relaxed whitespace-pre-wrap">{partner.bio}</p>

				<p className="bg-warning-100 text-warning-700 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed">
					선정적·신체접촉 암시 사진/문구, 조건만남 연상 표현이 포함된 프로필은 거절해주세요.
				</p>

				<div className="flex gap-2">
					<Button variant="outline" size="sm" fullWidth disabled={isMutating} onClick={onReject}>
						거절
					</Button>
					<Button variant="secondary" size="sm" fullWidth disabled={isMutating} onClick={onApprove}>
						승인
					</Button>
				</div>
			</DisclosurePanel>
		</Disclosure>
	);
}
