// features/partners/components/PartnerList/index.tsx
"use client";

import Link from "next/link";
import { useRef, useState, type JSX, type UIEvent } from "react";
import { PartnerListDeckCard } from "@/features/partners/components/PartnerList/PartnerListDeckCard";
import { usePartnerListQuery } from "@/features/partners/queries";
import { usePartnerRatingsQuery } from "@/features/reviews/queries";
import { useMyBlocksQuery } from "@/features/safety/queries";
import { cn } from "@/utils/cn";

const INTEREST_FILTERS = ["전체", "카페", "전시", "산책", "맛집", "영화"];

type PartnerListProps = {
	searchQuery?: string;
};

export function PartnerList({ searchQuery = "" }: PartnerListProps): JSX.Element {
	const { data: partners, isPending, isError } = usePartnerListQuery();
	const { data: blocks, isPending: isBlocksPending } = useMyBlocksQuery();
	const { data: ratings } = usePartnerRatingsQuery(
		(partners ?? []).map(function (partner) {
			return partner.profile_id;
		}),
	);
	const [activeFilter, setActiveFilter] = useState("전체");
	const [deckIndex, setDeckIndex] = useState(0);
	const deckRef = useRef<HTMLDivElement>(null);

	function handleDeckScroll(event: UIEvent<HTMLDivElement>): void {
		const deck = event.currentTarget;
		setDeckIndex(Math.round(deck.scrollLeft / deck.clientWidth));
	}

	function handleDeckStep(direction: -1 | 1): void {
		const deck = deckRef.current;
		if (deck) {
			deck.scrollBy({ left: direction * deck.clientWidth, behavior: "smooth" });
		}
	}

	if (isPending || isBlocksPending) {
		return (
			<div className="flex flex-col gap-3">
				<div className="bg-surface-alt aspect-[3/4] w-full animate-pulse rounded-3xl" />
				<div className="bg-surface-alt mx-auto h-4 w-1/3 animate-pulse rounded" />
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
	const chipFilteredPartners =
		activeFilter === "전체"
			? visiblePartners
			: visiblePartners.filter(function (partner) {
					return partner.interests.some(function (interest) {
						return interest.includes(activeFilter);
					});
				});

	const normalizedQuery = searchQuery.trim().toLowerCase();
	const filteredPartners =
		normalizedQuery === ""
			? chipFilteredPartners
			: chipFilteredPartners.filter(function (partner) {
					return (
						partner.nickname.toLowerCase().includes(normalizedQuery) ||
						partner.region.toLowerCase().includes(normalizedQuery) ||
						partner.interests.some(function (interest) {
							return interest.toLowerCase().includes(normalizedQuery);
						}) ||
						partner.purpose_tags.some(function (tag) {
							return tag.toLowerCase().includes(normalizedQuery);
						})
					);
				});

	function getEmptyMessage(): string {
		if (normalizedQuery !== "") {
			return `'${searchQuery.trim()}' 검색 결과가 없어요.`;
		}
		if (activeFilter !== "전체") {
			return `'${activeFilter}' 관심사를 가진 파트너가 아직 없어요.`;
		}
		return "아직 등록된 파트너가 없어요.";
	}

	const clampedIndex = Math.min(deckIndex, Math.max(filteredPartners.length - 1, 0));

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
								isActive && "bg-inverse text-inverse-fg font-semibold",
								!isActive && "border-line bg-surface text-body border",
							)}>
							{filter}
						</button>
					);
				})}
			</div>
			{filteredPartners.length === 0 ? (
				<p className="text-sub py-16 text-center text-sm">{getEmptyMessage()}</p>
			) : (
				<div className="flex flex-col gap-3">
					<div
						ref={deckRef}
						onScroll={handleDeckScroll}
						className="-mx-5 flex snap-x snap-mandatory scrollbar-none gap-3 overflow-x-auto px-5">
						{filteredPartners.map(function (partner, index) {
							return (
								<Link
									key={partner.profile_id}
									href={`/partners/${partner.profile_id}`}
									aria-label={`${partner.nickname} 프로필 보기`}
									className="w-full shrink-0 snap-center">
									<PartnerListDeckCard
										partner={partner}
										index={index}
										rating={ratings?.[partner.profile_id]}
									/>
								</Link>
							);
						})}
					</div>
					<div className="flex items-center justify-between px-1">
						<button
							type="button"
							onClick={function () {
								handleDeckStep(-1);
							}}
							disabled={clampedIndex === 0}
							aria-label="이전 파트너"
							className="bg-surface-alt text-body flex size-11 items-center justify-center rounded-full disabled:opacity-40">
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round">
								<path d="M15 5l-7 7 7 7" />
							</svg>
						</button>
						<span className="text-sub text-sm tabular-nums">
							{clampedIndex + 1} / {filteredPartners.length}
						</span>
						<button
							type="button"
							onClick={function () {
								handleDeckStep(1);
							}}
							disabled={clampedIndex >= filteredPartners.length - 1}
							aria-label="다음 파트너"
							className="bg-surface-alt text-body flex size-11 items-center justify-center rounded-full disabled:opacity-40">
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round">
								<path d="M9 5l7 7-7 7" />
							</svg>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
