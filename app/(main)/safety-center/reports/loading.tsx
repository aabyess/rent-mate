// app/(main)/safety-center/reports/loading.tsx
import type { JSX } from "react";

export default function SafetyCenterReportsLoading(): JSX.Element {
	return (
		<div className="flex flex-col gap-4 px-5 py-4">
			<div className="bg-surface-alt h-7 w-1/3 animate-pulse rounded-lg" />
			<div className="bg-surface-alt h-20 animate-pulse rounded-2xl" />
		</div>
	);
}
