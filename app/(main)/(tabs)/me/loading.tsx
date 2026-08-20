// app/(main)/(tabs)/me/loading.tsx
import type { JSX } from "react";

export default function MyPageLoading(): JSX.Element {
	return (
		<main className="flex flex-col gap-4 px-5 py-4">
			<div className="bg-surface-alt h-9 w-2/5 animate-pulse rounded-lg" />
			<div className="bg-surface-alt h-24 animate-pulse rounded-2xl" />
			<div className="bg-surface-alt h-40 animate-pulse rounded-2xl" />
			<div className="bg-surface-alt h-40 animate-pulse rounded-2xl" />
		</main>
	);
}
