// app/(main)/partners/[id]/loading.tsx
import type { JSX } from "react";

export default function PartnerDetailLoading(): JSX.Element {
	return (
		<main className="flex flex-col gap-5">
			<div className="bg-surface-alt aspect-[3/4] w-full animate-pulse" />
			<div className="flex flex-col gap-3 px-5">
				<div className="bg-surface-alt h-7 w-1/2 animate-pulse rounded-lg" />
				<div className="bg-surface-alt h-4 w-1/3 animate-pulse rounded" />
				<div className="bg-surface-alt h-20 animate-pulse rounded-2xl" />
			</div>
		</main>
	);
}
