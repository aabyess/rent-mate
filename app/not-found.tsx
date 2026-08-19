// app/not-found.tsx
import Link from "next/link";
import type { JSX } from "react";

export default function NotFoundPage(): JSX.Element {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
			<span className="text-brand text-[44px] font-bold tracking-tight tabular-nums">404</span>
			<div className="flex flex-col gap-1.5">
				<h1 className="text-xl font-bold">페이지를 찾을 수 없어요</h1>
				<p className="text-sub text-sm leading-relaxed">
					주소가 바뀌었거나 삭제된 페이지예요.
					<br />
					홈에서 파트너를 다시 둘러보세요.
				</p>
			</div>
			<Link
				href="/"
				className="bg-brand hover:bg-primary-600 flex h-12 items-center justify-center rounded-xl px-6 font-medium text-white transition-colors">
				홈으로 가기
			</Link>
		</main>
	);
}
