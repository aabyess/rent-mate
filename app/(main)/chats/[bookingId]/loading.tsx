// app/(main)/chats/[bookingId]/loading.tsx
import type { JSX } from "react";

export default function ChatRoomLoading(): JSX.Element {
	return (
		<div className="flex flex-col gap-3 px-5 py-5">
			<div className="bg-surface-alt h-14 animate-pulse rounded-2xl" />
			<div className="bg-surface-alt h-64 animate-pulse rounded-2xl" />
		</div>
	);
}
