// features/safety/components/SafetyCenter/index.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { JSX, ReactNode } from "react";

type SafetyCenterSection = {
	href: string;
	label: string;
	description: string;
	icon: ReactNode;
};

const SECTIONS: SafetyCenterSection[] = [
	{
		href: "/safety-center/reports",
		label: "신고 내역",
		description: "내가 접수한 신고와 처리 상태를 확인해요",
		icon: (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round">
				<path d="M5 3v18M5 4h11l-2.5 4L16 12H5" />
			</svg>
		),
	},
	{
		href: "/safety-center/blocks",
		label: "차단 목록",
		description: "차단한 사용자를 관리해요",
		icon: (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round">
				<circle cx="12" cy="12" r="9" />
				<path d="M5.6 5.6l12.8 12.8" />
			</svg>
		),
	},
	{
		href: "/safety-center/emergency",
		label: "긴급 연락",
		description: "위급 상황에서는 바로 112에 신고해요",
		icon: (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round">
				<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
			</svg>
		),
	},
	{
		href: "/policies/safety",
		label: "안전 정책",
		description: "금지 행위와 제재 기준을 확인해요",
		icon: (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round">
				<path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" />
				<path d="M9 12l2 2 4-4" />
			</svg>
		),
	},
];

export function SafetyCenter(): JSX.Element {
	const router = useRouter();

	function handleBack(): void {
		router.back();
	}

	return (
		<div className="flex flex-col">
			<header className="bg-bg/80 sticky top-0 z-10 flex items-center gap-3 px-5 py-3 backdrop-blur-xl">
				<button type="button" onClick={handleBack} aria-label="뒤로 가기">
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M15 5l-7 7 7 7" />
					</svg>
				</button>
				<h1 className="text-lg font-bold">안전 센터</h1>
			</header>

			<div className="flex flex-col gap-4 px-5 py-4 pb-12">
				<p className="bg-warning-500/15 text-warning-500 rounded-xl px-4 py-3 text-sm leading-relaxed">
					위험을 느끼면 망설이지 말고 바로 경찰에 신고하세요. 데이트는 항상 공개 장소에서만
					진행돼요.
				</p>

				<div className="flex flex-col gap-2.5">
					{SECTIONS.map(function (section) {
						return (
							<Link
								key={section.href}
								href={section.href}
								className="bg-surface flex items-center gap-3.5 rounded-2xl px-4.5 py-4">
								<span className="text-sub flex size-9 shrink-0 items-center justify-center">
									{section.icon}
								</span>
								<div className="flex flex-col gap-0.5">
									<span className="text-[15px] font-semibold">{section.label}</span>
									<span className="text-sub text-xs">{section.description}</span>
								</div>
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
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
