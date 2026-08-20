// app/(main)/safety-center/emergency/page.tsx
import Link from "next/link";
import type { JSX } from "react";
import { SafetyCenterEmergency } from "@/features/safety/components/SafetyCenter/SafetyCenterEmergency";

export default function SafetyCenterEmergencyPage(): JSX.Element {
	return (
		<main className="flex flex-col gap-5 px-5 py-4 pb-16">
			<div className="flex items-center gap-3">
				<Link href="/safety-center" aria-label="안전 센터로 돌아가기">
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
				</Link>
				<h1 className="text-lg font-bold">긴급 연락</h1>
			</div>
			<SafetyCenterEmergency />
		</main>
	);
}
