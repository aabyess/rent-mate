// app/(main)/sports-mate/requests/[requestId]/chat/page.tsx
"use client";

import { useParams } from "next/navigation";
import type { JSX } from "react";
import { SportsMateChatRoom } from "@/features/sportsMate/components/SportsMateChatRoom";

export default function SportsMateChatPage(): JSX.Element {
	const params = useParams<{ requestId: string }>();
	return <SportsMateChatRoom requestId={params.requestId} />;
}
