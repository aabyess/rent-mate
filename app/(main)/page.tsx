// app/(main)/page.tsx
import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";

export default function HomePage(): JSX.Element {
	return (
		<main className="flex flex-col">
			<header className="border-line bg-surface flex flex-col gap-3 border-b px-5 pt-4 pb-3">
				<div className="flex items-center justify-between">
					<h1 className="text-brand text-[22px] font-bold tracking-tight">RentMate</h1>
					<Badge variant="trust">
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" />
							<path d="M9 12l2 2 4-4" />
						</svg>
						안전 정책
					</Badge>
				</div>
				<div className="bg-surface-alt text-sub flex h-12 items-center gap-2.5 rounded-[14px] px-4 text-[15px]">
					<svg
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
					지역 · 날짜로 파트너 찾기
				</div>
			</header>
			<section className="flex flex-col gap-3.5 px-5 py-4">
				<div className="flex items-baseline justify-between">
					<h2 className="text-lg font-semibold">지금 만날 수 있는 파트너</h2>
				</div>
				<p className="text-sub py-16 text-center text-sm">파트너 목록 기능 준비 중입니다.</p>
			</section>
		</main>
	);
}
