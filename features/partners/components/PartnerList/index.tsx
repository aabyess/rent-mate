// features/partners/components/PartnerList/index.tsx
"use client";

import { AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type JSX } from "react";
import { REGIONS } from "@/constants/regions";
import { PartnerListDeckAdCard } from "@/features/partners/components/PartnerList/PartnerListDeckAdCard";
import { PartnerListDeckCard } from "@/features/partners/components/PartnerList/PartnerListDeckCard";
import {
	PartnerListDeckMotionCard,
	type DeckMotionCustom,
} from "@/features/partners/components/PartnerList/PartnerListDeckMotionCard";
import { usePartnerListQuery } from "@/features/partners/queries";
import type { PartnerCardItem } from "@/features/partners/types";
import { useMyPreferencesQuery } from "@/features/preferences/queries";
import { usePartnerRatingsQuery } from "@/features/reviews/queries";
import { useMyBlocksQuery } from "@/features/safety/queries";
import { cn } from "@/utils/cn";

const INTEREST_FILTERS = ["전체", "카페", "전시", "산책", "맛집", "영화"];
const REGION_FILTERS = ["전체", ...REGIONS];
const AD_INTERVAL = 5; // 파트너 카드 5장마다 광고 카드 1장
const AUTOPLAY_MS = 3000;
const STACK_SIZE = 3;

type DeckItem =
	| { kind: "partner"; partner: PartnerCardItem; partnerIndex: number }
	| { kind: "ad"; adIndex: number };

function buildDeckItems(partners: PartnerCardItem[]): DeckItem[] {
	const items: DeckItem[] = [];
	partners.forEach(function (partner, index) {
		items.push({ kind: "partner", partner, partnerIndex: index });
		if ((index + 1) % AD_INTERVAL === 0) {
			items.push({ kind: "ad", adIndex: (index + 1) / AD_INTERVAL - 1 });
		}
	});
	return items;
}

// 접속할 때마다 덱 순서가 달라지도록 시드 기반으로 섞는다 — 시드를 상태로 고정해
// 리렌더·데이터 refetch에도 세션 내 순서는 유지된다
function shuffleWithSeed<T>(items: T[], seed: number): T[] {
	const result = [...items];
	let state = seed;
	for (let i = result.length - 1; i > 0; i -= 1) {
		state = (state * 1664525 + 1013904223) % 4294967296;
		const j = state % (i + 1);
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

type PartnerListProps = {
	searchQuery?: string;
};

export function PartnerList({ searchQuery = "" }: PartnerListProps): JSX.Element {
	const router = useRouter();
	const { data: partners, isPending, isError } = usePartnerListQuery();
	const { data: blocks, isPending: isBlocksPending } = useMyBlocksQuery();
	const { data: myPreferences, isPending: isPreferencesPending } = useMyPreferencesQuery();
	const { data: ratings } = usePartnerRatingsQuery(
		(partners ?? []).map(function (partner) {
			return partner.profile_id;
		}),
	);
	const [activeFilter, setActiveFilter] = useState("전체");
	const [activeRegion, setActiveRegion] = useState("전체");
	// deckPosition은 단조 증가하는 스택 위치 — 실제 카드는 deckItems[position % length]
	const [deckPosition, setDeckPosition] = useState(0);
	const [navDirection, setNavDirection] = useState<-1 | 1>(1);
	const [exitX, setExitX] = useState<-1 | 1>(-1);
	const [isDeckPaused, setIsDeckPaused] = useState(false);
	const resumeTimerRef = useRef<number | null>(null);
	const lastTouchAtRef = useRef(0);
	const [shuffleSeed] = useState(function () {
		return Math.floor(Math.random() * 2147483647) + 1;
	});

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
	const shuffledPartners = shuffleWithSeed(filteredPartners, shuffleSeed);
	// 취향(관심사·지역·목적)이 겹칠수록 앞쪽에 — 동점끼리는 셔플 순서 유지(stable sort)
	function scoreByPreferences(partner: PartnerCardItem): number {
		if (!myPreferences) {
			return 0;
		}
		let score = 0;
		score += partner.interests.filter(function (interest) {
			return myPreferences.interests.includes(interest);
		}).length;
		if (myPreferences.regions.includes(partner.region)) {
			score += 1;
		}
		score += partner.purpose_tags.filter(function (tag) {
			return myPreferences.purposes.includes(tag);
		}).length;
		return score;
	}
	const rankedPartners = [...shuffledPartners].sort(function (a, b) {
		return scoreByPreferences(b) - scoreByPreferences(a);
	});
	const deckItems = buildDeckItems(rankedPartners);
	const deckCount = deckItems.length;

	// 필터·검색이 바뀌면 스택을 처음부터 다시 쌓는다 (렌더 중 상태 조정 패턴)
	const filterSignature = `${activeFilter}|${activeRegion}|${normalizedQuery}`;
	const [prevFilterSignature, setPrevFilterSignature] = useState(filterSignature);
	if (prevFilterSignature !== filterSignature) {
		setPrevFilterSignature(filterSignature);
		setDeckPosition(0);
		setNavDirection(1);
	}

	// 3초마다 다음 카드로 자동 넘김 — 사용자가 만지는 동안은 정지
	useEffect(
		function () {
			if (isDeckPaused || deckCount <= 1) {
				return;
			}
			const timer = setInterval(function () {
				setExitX(-1);
				setNavDirection(1);
				setDeckPosition(function (position) {
					return position + 1;
				});
			}, AUTOPLAY_MS);
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

	// 손을 뗀 직후 바로 자동 넘김이 끼어들지 않도록 잠깐 여유를 두고 재개한다
	function scheduleDeckResume(): void {
		if (resumeTimerRef.current !== null) {
			clearTimeout(resumeTimerRef.current);
		}
		resumeTimerRef.current = window.setTimeout(function () {
			resumeTimerRef.current = null;
			setIsDeckPaused(false);
		}, 800);
	}

	function pauseDeck(): void {
		if (resumeTimerRef.current !== null) {
			clearTimeout(resumeTimerRef.current);
			resumeTimerRef.current = null;
		}
		setIsDeckPaused(true);
	}

	function handleSwipe(direction: -1 | 1): void {
		setExitX(direction);
		setNavDirection(1);
		setDeckPosition(function (position) {
			return position + 1;
		});
	}

	function handleDeckStep(direction: -1 | 1): void {
		if (direction === 1) {
			handleSwipe(-1);
			return;
		}
		if (deckPosition === 0) {
			return;
		}
		setNavDirection(-1);
		setDeckPosition(function (position) {
			return position - 1;
		});
	}

	if (isPending || isBlocksPending || isPreferencesPending) {
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

	// 아래 카드부터 그려서 맨 위 카드가 마지막(위)에 오도록 한다
	const stack: { position: number; item: DeckItem; offset: number }[] = [];
	if (deckCount > 0) {
		for (let offset = Math.min(STACK_SIZE, deckCount) - 1; offset >= 0; offset -= 1) {
			const position = deckPosition + offset;
			stack.push({ position, item: deckItems[position % deckCount], offset });
		}
	}
	const topItem = deckCount > 0 ? deckItems[deckPosition % deckCount] : null;
	const presenceCustom: DeckMotionCustom = { exitX, nav: navDirection, offset: 0 };

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
			{deckCount === 0 ? (
				<p className="text-sub py-16 text-center text-sm">{getEmptyMessage()}</p>
			) : (
				<div className="flex flex-col gap-3">
					<div
						onTouchStart={function () {
							lastTouchAtRef.current = Date.now();
							pauseDeck();
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
							pauseDeck();
						}}
						onMouseLeave={function () {
							if (Date.now() - lastTouchAtRef.current < 1000) {
								return;
							}
							scheduleDeckResume();
						}}
						className="relative aspect-[3/4] w-full pb-6">
						<AnimatePresence initial={false} custom={presenceCustom}>
							{stack.map(function ({ position, item, offset }) {
								const custom: DeckMotionCustom = { exitX, nav: navDirection, offset };
								if (item.kind === "ad") {
									return (
										<PartnerListDeckMotionCard
											key={position}
											isTop={offset === 0}
											custom={custom}
											ariaLabel="광고 카드"
											onSwipe={handleSwipe}
											onDragStart={pauseDeck}
											onDragEnd={scheduleDeckResume}>
											<PartnerListDeckAdCard />
										</PartnerListDeckMotionCard>
									);
								}
								return (
									<PartnerListDeckMotionCard
										key={position}
										isTop={offset === 0}
										custom={custom}
										ariaLabel={`${item.partner.nickname} 프로필 보기`}
										onSwipe={handleSwipe}
										onDragStart={pauseDeck}
										onDragEnd={scheduleDeckResume}
										onTap={function () {
											router.push(`/partners/${item.partner.profile_id}`);
										}}>
										<PartnerListDeckCard
											partner={item.partner}
											index={item.partnerIndex}
											rating={ratings?.[item.partner.profile_id]}
										/>
									</PartnerListDeckMotionCard>
								);
							})}
						</AnimatePresence>
					</div>
					<div className="flex items-center justify-between px-1">
						<button
							type="button"
							onClick={function () {
								handleDeckStep(-1);
							}}
							disabled={deckPosition === 0}
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
							{topItem?.kind === "partner"
								? `${topItem.partnerIndex + 1} / ${rankedPartners.length}`
								: "광고"}
						</span>
						<button
							type="button"
							onClick={function () {
								handleDeckStep(1);
							}}
							aria-label="다음 파트너"
							className="bg-surface-alt text-body flex size-11 items-center justify-center rounded-full">
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
