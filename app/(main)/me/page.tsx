// app/(main)/me/page.tsx
import type { JSX } from "react";

export default function MyPage(): JSX.Element {
	return (
		<main className="flex flex-col gap-4 px-5 py-4">
			<h1 className="text-xl font-semibold">마이페이지</h1>
			<p className="text-sub py-16 text-center text-sm">마이페이지 기능 준비 중입니다.</p>
		</main>
	);
}
