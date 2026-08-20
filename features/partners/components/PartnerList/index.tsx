// features/partners/components/PartnerList/index.tsx
"use client";

import { AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type JSX } from "react";
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
	const normalizedQuery = searchQuery.trim().toLowerCase();
	const filteredPartners =
		normalizedQuery === ""
			? visiblePartners
			: visiblePartners.filter(function (partner) {
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
	const filterSignature = normalizedQuery;
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
				<div className="bg-surface-alt aspect-[2/3] w-full animate-pulse rounded-xl" />
				<div className="bg-surface-alt mx-auto h-4 w-1/3 animate-pulse rounded" />
			</div>
		);
	}

	if (isError) {
		return <p className="text-sub py-16 text-center text-sm">파트너 목록을 불러오지 못했어요.</p>;
	}

	function getEmptyMessage(): string {
		return `'${searchQuery.trim()}' 검색 결과가 없어요.`;
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
			{deckCount === 0 ? (
				visiblePartners.length === 0 ? (
					<div className="bg-surface flex flex-col items-center gap-4 rounded-xl px-6 py-16 text-center">
						<div className="bg-brand-subtle flex size-14 items-center justify-center rounded-2xl">
							<svg
								width="26"
								height="26"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-brand">
								<path d="M19.5 12.6L12 20l-7.5-7.4A5 5 0 1 1 12 6a5 5 0 1 1 7.5 6.6z" />
							</svg>
						</div>
						<div className="flex flex-col gap-1.5">
							<p className="text-[17px] font-bold">아직 만날 수 있는 파트너가 없어요</p>
							<p className="text-sub text-sm leading-relaxed">
								곧 새로운 파트너들이 찾아올 거예요.
								<br />
								먼저 파트너로 활동을 시작해보는 건 어때요?
							</p>
						</div>
						<Link
							href="/partner/register"
							className="bg-brand hover:bg-primary-600 flex h-11 items-center justify-center rounded-xl px-5 text-sm font-medium text-white transition-colors">
							파트너로 활동하기
						</Link>
					</div>
				) : (
					<p className="text-sub py-16 text-center text-sm">{getEmptyMessage()}</p>
				)
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
						className="relative aspect-[2/3] w-full pb-6">
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
										onTap={function (event) {
											// 좋아요·찜 오버레이 탭은 프로필 이동으로 이어지지 않게 한다
											if ((event.target as HTMLElement | null)?.closest("[data-deck-action]")) {
												return;
											}
											router.push(`/partners/${item.partner.profile_id}`);
										}}>
										<PartnerListDeckCard
											partner={item.partner}
											index={item.partnerIndex}
											rating={ratings?.[item.partner.profile_id]}
											showActions={offset === 0}
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
