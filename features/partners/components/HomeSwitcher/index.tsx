// features/partners/components/HomeSwitcher/index.tsx
"use client";

import { useState, type JSX } from "react";
import { PartnerBlog } from "@/features/partners/components/PartnerBlog";
import { PartnerExplorer } from "@/features/partners/components/PartnerExplorer";
import { PartnerHome } from "@/features/partners/components/PartnerHome";
import { useMyPartnerProfileQuery } from "@/features/partners/queries";
import { cn } from "@/utils/cn";

const VIEWS = [
	{ key: "partner", label: "파트너 홈" },
	{ key: "blog", label: "내 블로그" },
] as const;

type ViewKey = (typeof VIEWS)[number]["key"];

// 승인된 파트너는 홈에서 탐색 덱 대신 파트너 홈이 기본 — 두 번째 탭은 내 블로그(꾸미기·글쓰기)
export function HomeSwitcher(): JSX.Element {
	const { data: myPartnerProfile, isPending } = useMyPartnerProfileQuery();
	const [view, setView] = useState<ViewKey>("partner");

	if (isPending) {
		return (
			<div className="flex flex-col gap-3 px-5 py-4">
				<div className="bg-surface-alt aspect-[3/4] w-full animate-pulse rounded-3xl" />
			</div>
		);
	}

	const isApprovedPartner = !!myPartnerProfile && myPartnerProfile.is_approved;
	if (!isApprovedPartner) {
		return <PartnerExplorer />;
	}

	return (
		<div className="flex flex-col">
			<div className="bg-surface-alt mx-5 mt-3 flex rounded-xl p-1">
				{VIEWS.map(function (item) {
					const isActive = view === item.key;
					return (
						<button
							key={item.key}
							type="button"
							onClick={function () {
								setView(item.key);
							}}
							className={cn(
								"h-9 flex-1 rounded-lg text-sm transition-colors",
								isActive && "bg-surface text-body font-semibold shadow-sm",
								!isActive && "text-sub",
							)}>
							{item.label}
						</button>
					);
				})}
			</div>
			{view === "partner" ? (
				<PartnerHome partnerProfile={myPartnerProfile} />
			) : (
				<PartnerBlog partnerProfile={myPartnerProfile} />
			)}
		</div>
	);
}
