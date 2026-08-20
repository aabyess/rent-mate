// app/welcome/page.tsx
"use client";

import { useRouter } from "next/navigation";
import type { JSX } from "react";

// 프로필 생성 직후 1회 노출되는 역할 선택 화면 — 고객은 바로 탐색으로,
// 파트너 희망자는 파트너 등록 폼으로 보낸다 (등록 후 승인 전까지는 고객과 동일하게 이용 가능)
export default function WelcomePage(): JSX.Element {
	const router = useRouter();

	function handleCustomerStart(): void {
		router.replace("/intro");
	}

	function handlePartnerStart(): void {
		router.replace("/partner/register");
	}

	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
			<div className="from-primary-50 to-secondary-50 via-bg absolute inset-0 bg-gradient-to-br" />
			<div className="bg-primary-200/40 absolute -top-24 -right-20 size-72 rounded-full blur-3xl" />
			<div className="bg-secondary-200/40 absolute -bottom-28 -left-24 size-80 rounded-full blur-3xl" />
			<div className="relative flex w-full max-w-sm flex-col gap-6">
				<div className="flex flex-col gap-1.5">
					<span className="text-brand text-[22px] font-bold tracking-tight">RentMate</span>
					<h1 className="text-2xl font-bold">어떻게 시작할까요?</h1>
					<p className="text-sub text-sm">나중에 마이페이지에서 언제든 바꿀 수 있어요.</p>
				</div>
				<button
					type="button"
					onClick={handleCustomerStart}
					className="bg-surface flex flex-col gap-1.5 rounded-2xl p-5 text-left shadow-sm">
					<span className="text-[17px] font-bold">데이트 상대를 찾고 있어요</span>
					<span className="text-sub text-sm leading-relaxed">
						마음에 드는 파트너를 골라 시간제로 데이트를 예약해요.
					</span>
					<span className="text-brand pt-1 text-sm font-semibold">파트너 둘러보기 →</span>
				</button>
				<button
					type="button"
					onClick={handlePartnerStart}
					className="bg-surface flex flex-col gap-1.5 rounded-2xl p-5 text-left shadow-sm">
					<span className="text-[17px] font-bold">파트너로 활동하고 싶어요</span>
					<span className="text-sub text-sm leading-relaxed">
						프로필과 시간당 요금을 등록하면 승인 후 활동을 시작할 수 있어요. 승인 전에도 고객으로
						이용할 수 있어요.
					</span>
					<span className="text-trust pt-1 text-sm font-semibold">파트너 등록하기 →</span>
				</button>
			</div>
		</main>
	);
}
