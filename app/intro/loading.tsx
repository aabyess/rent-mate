// app/intro/loading.tsx
import type { JSX } from "react";

// 로그인 성공 → 인트로 도착 사이의 죽은 시간을 브랜드 톤으로 메운다
export default function IntroLoading(): JSX.Element {
	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden">
			<div className="from-primary-50 to-secondary-50 via-bg absolute inset-0 bg-gradient-to-br" />
			<span className="text-brand relative animate-pulse text-4xl font-bold tracking-tight">
				RentMate
			</span>
		</main>
	);
}
