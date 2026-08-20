// features/partners/components/PartnerExplorer/index.tsx
"use client";

import { useState, type JSX } from "react";
import { PartnerList } from "@/features/partners/components/PartnerList";

export function PartnerExplorer(): JSX.Element {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className="flex flex-col">
			<div className="border-line bg-surface border-b px-5 pb-3">
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
			</div>
			<section className="flex flex-col gap-3.5 px-5 py-4">
				<PartnerList searchQuery={searchQuery} />
			</section>
		</div>
	);
}
