// app/(main)/(tabs)/chats/loading.tsx
import type { JSX } from "react";

export default function ChatsLoading(): JSX.Element {
	return (
		<main className="flex flex-col gap-4 px-5 py-4">
			<div className="bg-surface-alt h-9 w-1/4 animate-pulse rounded-lg" />
			<div className="flex flex-col gap-3">
				<div className="bg-surface-alt h-16 animate-pulse rounded-2xl" />
				<div className="bg-surface-alt h-16 animate-pulse rounded-2xl" />
				<div className="bg-surface-alt h-16 animate-pulse rounded-2xl" />
				<div className="bg-surface-alt h-16 animate-pulse rounded-2xl" />
			</div>
		</main>
	);
}
