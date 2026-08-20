// app/(main)/(tabs)/bookings/loading.tsx
import type { JSX } from "react";

export default function BookingsLoading(): JSX.Element {
	return (
		<main className="flex flex-col gap-4 px-5 py-4">
			<div className="bg-surface-alt h-9 w-1/3 animate-pulse rounded-lg" />
			<div className="bg-surface-alt h-11 w-full animate-pulse rounded-xl" />
			<div className="bg-surface-alt h-32 animate-pulse rounded-2xl" />
			<div className="bg-surface-alt h-32 animate-pulse rounded-2xl" />
			<div className="bg-surface-alt h-32 animate-pulse rounded-2xl" />
		</main>
	);
}
