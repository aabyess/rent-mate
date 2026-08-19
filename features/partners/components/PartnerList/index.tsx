// features/partners/components/PartnerList/index.tsx
"use client";

import Link from "next/link";
import { useState, type JSX } from "react";
import { PartnerListCard } from "@/features/partners/components/PartnerList/PartnerListCard";
import { usePartnerListQuery } from "@/features/partners/queries";
import { useMyBlocksQuery } from "@/features/safety/queries";
import { cn } from "@/utils/cn";

const INTEREST_FILTERS = ["전체", "카페", "전시", "산책", "맛집", "영화"];

export function PartnerList(): JSX.Element {
	const { data: partners, isPending, isError } = usePartnerListQuery();
	const { data: blocks, isPending: isBlocksPending } = useMyBlocksQuery();
	const [activeFilter, setActiveFilter] = useState("전체");

	if (isPending || isBlocksPending) {
		return (
			<div className="grid grid-cols-2 gap-3.5">
				{Array.from({ length: 4 }, function (_, index) {
					return (
						<div key={index} className="flex flex-col gap-2">
							<div className="bg-surface-alt h-56 animate-pulse rounded-2xl" />
							<div className="bg-surface-alt h-4 w-2/3 animate-pulse rounded" />
							<div className="bg-surface-alt h-3 w-1/2 animate-pulse rounded" />
						</div>
					);
				})}
			</div>
		);
	}

	if (isError) {
		return <p className="text-sub py-16 text-center text-sm">파트너 목록을 불러오지 못했어요.</p>;
	}

	const blockedIds = new Set(
		(blocks ?? []).map(function (block) {
			return block.blocked_id;
		}),
	);
	const visiblePartners = partners.filter(function (partner) {
		return !blockedIds.has(partner.profile_id);
	});
	const filteredPartners =
		activeFilter === "전체"
			? visiblePartners
			: visiblePartners.filter(function (partner) {
					return partner.interests.some(function (interest) {
						return interest.includes(activeFilter);
					});
				});

	return (
		<div className="flex flex-col gap-3.5">
			<div className="-mx-5 flex scrollbar-none gap-2 overflow-x-auto px-5">
				{INTEREST_FILTERS.map(function (filter) {
					const isActive = activeFilter === filter;
					return (
						<button
							key={filter}
							type="button"
							onClick={function () {
								setActiveFilter(filter);
							}}
							className={cn(
								"h-9 shrink-0 rounded-full px-3.5 text-[13px]",
								isActive && "bg-neutral-900 font-semibold text-white",
								!isActive && "border-line bg-surface text-body border",
							)}>
							{filter}
						</button>
					);
				})}
			</div>
			{filteredPartners.length === 0 ? (
				<p className="text-sub py-16 text-center text-sm">
					{activeFilter === "전체"
						? "아직 등록된 파트너가 없어요."
						: `'${activeFilter}' 관심사를 가진 파트너가 아직 없어요.`}
				</p>
			) : (
				<div className="grid grid-cols-2 gap-3.5">
					{filteredPartners.map(function (partner, index) {
						return (
							<Link key={partner.profile_id} href={`/partners/${partner.profile_id}`}>
								<PartnerListCard partner={partner} index={index} />
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
