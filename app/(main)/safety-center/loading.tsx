// app/(main)/safety-center/loading.tsx
import type { JSX } from "react";

export default function SafetyCenterLoading(): JSX.Element {
	return (
		<div className="flex flex-col gap-4 px-5 py-4">
			<div className="bg-surface-alt h-7 w-1/3 animate-pulse rounded-lg" />
			<div className="bg-surface-alt h-16 animate-pulse rounded-xl" />
			<div className="flex flex-col gap-2.5">
				<div className="bg-surface-alt h-16 animate-pulse rounded-2xl" />
				<div className="bg-surface-alt h-16 animate-pulse rounded-2xl" />
				<div className="bg-surface-alt h-16 animate-pulse rounded-2xl" />
				<div className="bg-surface-alt h-16 animate-pulse rounded-2xl" />
			</div>
		</div>
	);
}
