// features/partners/components/PartnerList/index.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type JSX, type UIEvent } from "react";
import { REGIONS } from "@/constants/regions";
import { PartnerListDeckCard } from "@/features/partners/components/PartnerList/PartnerListDeckCard";
import { usePartnerListQuery } from "@/features/partners/queries";
import { usePartnerRatingsQuery } from "@/features/reviews/queries";
import { useMyBlocksQuery } from "@/features/safety/queries";
import { cn } from "@/utils/cn";

const INTEREST_FILTERS = ["전체", "카페", "전시", "산책", "맛집", "영화"];
const REGION_FILTERS = ["전체", ...REGIONS];

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
	const [activeRegion, setActiveRegion] = useState("전체");
	const [deckIndex, setDeckIndex] = useState(0);
	const [isDeckPaused, setIsDeckPaused] = useState(false);
	const deckRef = useRef<HTMLDivElement>(null);
	const resumeTimerRef = useRef<number | null>(null);
	const lastTouchAtRef = useRef(0);

	const blockedIds = new Set(
		(blocks ?? []).map(function (block) {
			return block.blocked_id;
		}),
	);
	const visiblePartners = (partners ?? []).filter(function (partner) {
		return !blockedIds.has(partner.profile_id);
	});
	const regionFilteredPartners =
		activeRegion === "전체"
			? visiblePartners
			: visiblePartners.filter(function (partner) {
					return partner.region === activeRegion;
				});
	const chipFilteredPartners =
		activeFilter === "전체"
			? regionFilteredPartners
			: regionFilteredPartners.filter(function (partner) {
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
	const deckCount = filteredPartners.length;

	// 3초마다 다음 카드로 자동 넘김 — 마지막에서 처음으로 순환, 사용자가 만지는 동안은 정지
	useEffect(
		function () {
			if (isDeckPaused || deckCount <= 1) {
				return;
			}
			const timer = setInterval(function () {
				const deck = deckRef.current;
				if (!deck) {
					return;
				}
				const nextIndex = (Math.round(deck.scrollLeft / deck.clientWidth) + 1) % deckCount;
				deck.scrollTo({ left: nextIndex * deck.clientWidth, behavior: "smooth" });
			}, 3000);
			return function () {
				clearInterval(timer);
			};
		},
		[isDeckPaused, deckCount],
	);

	useEffect(function () {
		return function () {
			if (resumeTimerRef.current !== null) {
				clearTimeout(resumeTimerRef.current);
			}
		};
	}, []);

	// 손을 뗀 뒤에도 관성 스크롤이 이어지는 동안은 자동 넘김을 재개하지 않는다
	function scheduleDeckResume(): void {
		if (resumeTimerRef.current !== null) {
			clearTimeout(resumeTimerRef.current);
		}
		resumeTimerRef.current = window.setTimeout(function () {
			resumeTimerRef.current = null;
			setIsDeckPaused(false);
		}, 800);
	}

	function handleDeckScroll(event: UIEvent<HTMLDivElement>): void {
		const deck = event.currentTarget;
		setDeckIndex(Math.round(deck.scrollLeft / deck.clientWidth));
		if (resumeTimerRef.current !== null) {
			scheduleDeckResume();
		}
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

	function getEmptyMessage(): string {
		if (normalizedQuery !== "") {
			return `'${searchQuery.trim()}' 검색 결과가 없어요.`;
		}
		if (activeRegion !== "전체" && activeFilter !== "전체") {
			return `'${activeRegion}' 지역의 '${activeFilter}' 관심사를 가진 파트너가 아직 없어요.`;
		}
		if (activeRegion !== "전체") {
			return `'${activeRegion}' 지역 파트너가 아직 없어요.`;
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
			<div className="-mx-5 flex scrollbar-none gap-2 overflow-x-auto px-5">
				{REGION_FILTERS.map(function (region) {
					const isActive = activeRegion === region;
					return (
						<button
							key={region}
							type="button"
							onClick={function () {
								setActiveRegion(region);
							}}
							className={cn(
								"h-9 shrink-0 rounded-full px-3.5 text-[13px]",
								isActive && "bg-inverse text-inverse-fg font-semibold",
								!isActive && "border-line bg-surface text-body border",
							)}>
							{region}
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
						onTouchStart={function () {
							lastTouchAtRef.current = Date.now();
							if (resumeTimerRef.current !== null) {
								clearTimeout(resumeTimerRef.current);
								resumeTimerRef.current = null;
							}
							setIsDeckPaused(true);
						}}
						onTouchEnd={function () {
							lastTouchAtRef.current = Date.now();
							scheduleDeckResume();
						}}
						onMouseEnter={function () {
							// 탭 직후 브라우저가 쏘는 합성 mouseenter는 mouseleave 없이 끝나 영구 정지를 만든다
							if (Date.now() - lastTouchAtRef.current < 1000) {
								return;
							}
							setIsDeckPaused(true);
						}}
						onMouseLeave={function () {
							if (Date.now() - lastTouchAtRef.current < 1000) {
								return;
							}
							setIsDeckPaused(false);
						}}
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
