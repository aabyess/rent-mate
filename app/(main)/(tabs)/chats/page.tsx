// app/(main)/(tabs)/chats/page.tsx
import type { JSX } from "react";
import { ChatRoomList } from "@/features/chats/components/ChatRoomList";

export default function ChatsPage(): JSX.Element {
	return (
		<main className="flex flex-col gap-4 px-5 py-4">
			<h1 className="text-[28px] font-bold">채팅</h1>
			<ChatRoomList />
		</main>
	);
}
