// features/safety/components/SafetyCenter/index.tsx
"use client";

import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { SafetyCenterBlockList } from "@/features/safety/components/SafetyCenter/SafetyCenterBlockList";
import { SafetyCenterEmergency } from "@/features/safety/components/SafetyCenter/SafetyCenterEmergency";
import { SafetyCenterReportList } from "@/features/safety/components/SafetyCenter/SafetyCenterReportList";

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

			<div className="flex flex-col gap-7 px-5 py-4 pb-12">
				<SafetyCenterEmergency />

				<section id="blocks" className="flex flex-col gap-3">
					<h2 className="text-[17px] font-semibold">차단 목록</h2>
					<SafetyCenterBlockList />
				</section>

				<section id="reports" className="flex flex-col gap-3">
					<h2 className="text-[17px] font-semibold">신고 내역</h2>
					<SafetyCenterReportList />
				</section>
			</div>
		</div>
	);
}
