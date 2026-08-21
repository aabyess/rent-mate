// features/partners/components/PartnerExplorer/index.tsx
"use client";

import Link from "next/link";
import { useState, type JSX } from "react";
import { useMyProfilePrivateQuery } from "@/features/auth/queries";
import { PartnerList } from "@/features/partners/components/PartnerList";
import { cn } from "@/utils/cn";

export function PartnerExplorer(): JSX.Element {
	const [searchQuery, setSearchQuery] = useState("");
	const [nearbyOnly, setNearbyOnly] = useState(false);
	const { data: profilePrivate } = useMyProfilePrivateQuery();
	const homeRegion = profilePrivate?.home_region ?? null;

	function handleNearbyToggle(): void {
		if (!homeRegion) {
			return;
		}
		setNearbyOnly(true);
	}

	return (
		<div className="flex flex-col">
			<div className="border-line bg-surface flex flex-col gap-2.5 border-b px-5 pb-3">
				<label className="bg-surface-alt text-body flex h-12 items-center gap-2.5 rounded-[14px] px-4">
					<svg
						className="text-sub shrink-0"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						strokeLinecap="round">
						<circle cx="11" cy="11" r="7" />
						<path d="M16.5 16.5L21 21" />
					</svg>
					<input
						type="search"
						value={searchQuery}
						onChange={function (event) {
							setSearchQuery(event.target.value);
						}}
						placeholder="닉네임 · 관심사로 파트너 찾기"
						className="placeholder:text-sub w-full bg-transparent text-[15px] focus:outline-none"
					/>
				</label>
				<div className="flex items-center gap-2">
					<div className="bg-surface-alt flex rounded-xl p-1">
						<button
							type="button"
							onClick={function () {
								setNearbyOnly(false);
							}}
							className={cn(
								"h-8 rounded-lg px-3 text-xs font-medium transition-colors",
								!nearbyOnly && "bg-surface text-body shadow-sm",
								nearbyOnly && "text-sub",
							)}>
							전체 보기
						</button>
						<button
							type="button"
							onClick={handleNearbyToggle}
							className={cn(
								"h-8 rounded-lg px-3 text-xs font-medium transition-colors",
								nearbyOnly && "bg-surface text-body shadow-sm",
								!nearbyOnly && "text-sub",
							)}>
							내 주변만
						</button>
					</div>
					{!homeRegion && (
						<Link href="/account" className="text-brand text-xs font-medium">
							지역 설정하고 내 주변만 보기 →
						</Link>
					)}
				</div>
			</div>
			<section className="flex flex-col gap-3.5 px-5 py-4">
				<PartnerList searchQuery={searchQuery} nearbyOnly={nearbyOnly} homeRegion={homeRegion} />
			</section>
		</div>
	);
}
