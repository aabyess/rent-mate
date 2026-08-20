// app/(main)/(tabs)/loading.tsx
import type { JSX } from "react";

// 탭 전환 즉시 뜨는 공통 스켈레톤 — 각 탭 페이지가 그리는 것과 동일한 톤
export default function TabsLoading(): JSX.Element {
	return (
		<main className="flex flex-col gap-4 px-5 py-4">
			<div className="bg-surface-alt h-9 w-2/5 animate-pulse rounded-lg" />
			<div className="flex gap-2">
				<div className="bg-surface-alt h-9 w-20 animate-pulse rounded-full" />
				<div className="bg-surface-alt h-9 w-20 animate-pulse rounded-full" />
				<div className="bg-surface-alt h-9 w-20 animate-pulse rounded-full" />
			</div>
			<div className="bg-surface-alt aspect-[3/4] w-full animate-pulse rounded-3xl" />
		</main>
	);
}
