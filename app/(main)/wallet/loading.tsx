// app/(main)/wallet/loading.tsx
import type { JSX } from "react";

export default function WalletLoading(): JSX.Element {
	return (
		<div className="flex flex-col gap-4 px-5 py-4">
			<div className="bg-surface-alt h-7 w-1/3 animate-pulse rounded-lg" />
			<div className="bg-surface-alt h-28 animate-pulse rounded-2xl" />
			<div className="bg-surface-alt h-13 animate-pulse rounded-xl" />
			<div className="bg-surface-alt h-13 animate-pulse rounded-xl" />
		</div>
	);
}
