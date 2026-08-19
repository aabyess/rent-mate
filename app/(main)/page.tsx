// app/(main)/page.tsx
import type { JSX } from "react";

export default function HomePage(): JSX.Element {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-2 px-4">
			<h1 className="text-2xl font-bold">RentMate</h1>
			<p className="text-gray-500">파트너 탐색 화면 (디자인 가이드 대기 중)</p>
		</main>
	);
}
