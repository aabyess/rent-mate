// features/chats/components/ChatRoom/ChatRoomMessageList.tsx
"use client";

import { useEffect, useRef, type JSX } from "react";
import type { ChatMessage } from "@/features/chats/types";
import { cn } from "@/utils/cn";

function formatMessageTime(createdAt: string): string {
	const date = new Date(createdAt);
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	return `${hours}:${minutes}`;
}

type ChatRoomMessageListProps = {
	messages: ChatMessage[];
	myProfileId: string;
	/** 특정 메시지를 지목해 신고 — 신고 사유에 메시지 ID가 태깅된다 */
	onReportClick: (message: ChatMessage) => void;
};

export function ChatRoomMessageList({
	messages,
	myProfileId,
	onReportClick,
}: ChatRoomMessageListProps): JSX.Element {
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(
		function () {
			bottomRef.current?.scrollIntoView({ block: "end" });
		},
		[messages.length],
	);

	if (messages.length === 0) {
		return (
			<p className="text-sub py-16 text-center text-sm">
				아직 메시지가 없어요. 첫 인사를 건네보세요!
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			{messages.map(function (message) {
				const isMine = message.sender_id === myProfileId;
				return (
					<div
						key={message.id}
						className={cn("flex flex-col gap-1", isMine ? "items-end" : "items-start")}>
						<div className={cn("flex items-end gap-1.5", isMine && "flex-row-reverse")}>
							<p
								className={cn(
									"max-w-[75%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed break-words whitespace-pre-wrap",
									isMine && "bg-brand text-white",
									!isMine && "bg-surface-alt text-body",
								)}>
								{message.content}
							</p>
							<span className="text-sub text-[11px] tabular-nums">
								{formatMessageTime(message.created_at)}
							</span>
							{!isMine && (
								<button
									type="button"
									onClick={function () {
										onReportClick(message);
									}}
									aria-label="이 메시지 신고"
									className="text-sub/50 hover:text-error-500 shrink-0 p-0.5">
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round">
										<path d="M4 21V4m0 11h14l-3-5 3-5H4" />
									</svg>
								</button>
							)}
						</div>
						{message.flagged && (
							<span className="text-warning-700 flex items-center gap-1.5 text-[11px]">
								금지 행위가 의심되는 메시지예요
								{!isMine && (
									<button
										type="button"
										onClick={function () {
											onReportClick(message);
										}}
										className="text-error-500 font-medium underline">
										신고하기
									</button>
								)}
							</span>
						)}
					</div>
				);
			})}
			<div ref={bottomRef} />
		</div>
	);
}
