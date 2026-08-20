// features/partners/components/PartnerList/PartnerListDeckAdCard.tsx
import type { JSX } from "react";

// 파트너 카드 5장마다 끼워 넣는 임시 광고 카드 — 실제 광고 지면이 생기기 전까지의
// 자리표시자. 데이트 코스 제휴(카페·전시 등) 톤을 유지하고, 유흥·선정 뉘앙스 금지.
export function PartnerListDeckAdCard(): JSX.Element {
	return (
		<article className="from-primary-50 to-secondary-50 via-surface relative flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br">
			<div className="bg-primary-200/40 absolute -top-16 -right-14 size-52 rounded-full blur-3xl" />
			<div className="bg-secondary-200/40 absolute -bottom-20 -left-16 size-60 rounded-full blur-3xl" />
			<span className="bg-inverse/70 text-inverse-fg absolute top-4 left-4 rounded-full px-2.5 py-1 text-[11px] font-semibold">
				광고
			</span>
			<div className="relative flex flex-col items-center gap-4 px-8 text-center">
				<div className="bg-surface flex size-16 items-center justify-center rounded-2xl shadow-sm">
					<svg
						width="30"
						height="30"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-brand">
						<path d="M17 8h1a3 3 0 0 1 0 6h-1" />
						<path d="M3 8h14v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
						<path d="M7 2v2M11 2v2M15 2v2" />
					</svg>
				</div>
				<div className="flex flex-col gap-1.5">
					<p className="text-xl font-bold tracking-tight">첫 만남은 분위기 좋은 카페에서</p>
					<p className="text-sub text-sm leading-relaxed">
						데이트 코스 제휴 광고가
						<br />이 자리에 표시될 예정이에요.
					</p>
				</div>
				<span className="border-line bg-surface text-sub rounded-full border px-3.5 py-1.5 text-xs font-medium">
					제휴 문의 준비 중
				</span>
			</div>
			<p className="text-sub absolute inset-x-0 bottom-5 text-center text-[11px]">
				RentMate Pro 구독 시 광고 없이 볼 수 있어요.
			</p>
		</article>
	);
}
