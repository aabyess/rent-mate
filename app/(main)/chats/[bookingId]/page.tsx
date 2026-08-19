// app/(main)/chats/[bookingId]/page.tsx
import type { JSX } from "react";
import { ChatRoom } from "@/features/chats/components/ChatRoom";

type ChatRoomPageProps = {
	params: Promise<{ bookingId: string }>;
};

export default async function ChatRoomPage({ params }: ChatRoomPageProps): Promise<JSX.Element> {
	const { bookingId } = await params;
	return <ChatRoom bookingId={bookingId} />;
}
