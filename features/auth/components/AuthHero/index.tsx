// features/auth/components/AuthHero/index.tsx
import type { JSX } from "react";

const TRUST_ITEMS = [
	{
		label: "전원 성인·실명 인증",
		icon: (
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
		),
	},
	{
		label: "대화 기록 보호",
		icon: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round">
				<rect x="4" y="10" width="16" height="10" rx="2" />
				<path d="M8 10V7a4 4 0 0 1 8 0v3" />
			</svg>
		),
	},
	{
		label: "에스크로 결제",
		icon: (
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round">
				<circle cx="12" cy="12" r="9" />
				<path d="M8.5 8.5l2 6 1.5-4.5 1.5 4.5 2-6M8 13.5h8" />
			</svg>
		),
	},
];

export function AuthHero(): JSX.Element {
	return (
		<div className="flex flex-col gap-4">
			<span className="text-brand text-[22px] font-bold tracking-tight">RentMate</span>
			<div className="flex flex-col gap-2">
				<h1 className="text-[28px] leading-[1.25] font-bold tracking-tight">
					연애, <span className="text-brand">연습</span>이
					<br />
					필요하니까
				</h1>
				<p className="text-sub text-[15px] leading-relaxed">
					대화가 어색해도, 데이트가 처음이어도 괜찮아요.
					<br />
					검증된 파트너와 공개 장소에서 편하게 연습하세요.
				</p>
			</div>
			<div className="flex flex-wrap gap-1.5">
				{TRUST_ITEMS.map(function (item) {
					return (
						<span
							key={item.label}
							className="bg-surface text-secondary-700 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
							{item.icon}
							{item.label}
						</span>
					);
				})}
			</div>
		</div>
	);
}
