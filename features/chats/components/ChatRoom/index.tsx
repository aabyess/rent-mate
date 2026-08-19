// features/chats/components/ChatRoom/index.tsx
"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type JSX } from "react";
import { useMyProfileQuery } from "@/features/auth/queries";
import { useBookingDetailQuery } from "@/features/bookings/queries";
import { BOOKING_STATUS_LABELS, formatBookingPeriod } from "@/features/bookings/utils";
import { ChatRoomMessageList } from "@/features/chats/components/ChatRoom/ChatRoomMessageList";
import { useChatRoomRealtime } from "@/features/chats/hooks";
import { useMarkChatReadMutation, useSendChatMessageMutation } from "@/features/chats/mutations";
import { useChatMessagesQuery } from "@/features/chats/queries";
import { findBannedPhrase } from "@/features/chats/utils";
import { BlockConfirmDialog } from "@/features/safety/components/BlockConfirmDialog";
import { ReportDialog } from "@/features/safety/components/ReportDialog";

type ChatRoomProps = {
	bookingId: string;
};

export function ChatRoom({ bookingId }: ChatRoomProps): JSX.Element {
	const router = useRouter();
	const { data: profile } = useMyProfileQuery();
	const { data: booking, isPending: isBookingPending } = useBookingDetailQuery(bookingId);
	const { data: messages, isPending: isMessagesPending } = useChatMessagesQuery(bookingId);
	const sendMessageMutation = useSendChatMessageMutation(bookingId);
	const markChatReadMutation = useMarkChatReadMutation();
	useChatRoomRealtime(bookingId);

	// 방에 머무는 동안 도착한 메시지까지 읽음 처리한다
	const messageCount = messages?.length ?? 0;
	const markChatRead = markChatReadMutation.mutate;
	useEffect(
		function () {
			if (messageCount > 0) {
				markChatRead(bookingId);
			}
		},
		[bookingId, messageCount, markChatRead],
	);

	const [content, setContent] = useState("");
	const [isReportOpen, setIsReportOpen] = useState(false);
	const [isBlockOpen, setIsBlockOpen] = useState(false);
	const [bannedPhrase, setBannedPhrase] = useState<string | null>(null);

	function handleBack(): void {
		router.back();
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		const trimmed = content.trim();
		if (trimmed.length === 0 || sendMessageMutation.isPending) {
			return;
		}
		// 조건만남 유도 등 금지 표현은 전송 전에 차단한다 (법적 제약 3번)
		const detected = findBannedPhrase(trimmed);
		if (detected !== null) {
			setBannedPhrase(detected);
			return;
		}
		sendMessageMutation.mutate(
			{ bookingId, content: trimmed },
			{
				onSuccess: function (): void {
					setContent("");
				},
			},
		);
	}

	if (isBookingPending || isMessagesPending || !profile) {
		return (
			<div className="flex flex-col gap-3 px-5 py-5">
				<div className="bg-surface-alt h-14 animate-pulse rounded-2xl" />
				<div className="bg-surface-alt h-64 animate-pulse rounded-2xl" />
			</div>
		);
	}

	if (!booking) {
		return (
			<div className="flex flex-col items-center gap-4 py-24">
				<p className="text-sub text-sm">채팅방을 찾을 수 없어요.</p>
				<Link href="/chats" className="text-brand font-medium underline">
					채팅 목록으로
				</Link>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col">
			<header className="border-line bg-surface/80 sticky top-0 z-10 flex flex-col gap-2.5 border-b px-5 py-3 backdrop-blur-xl">
				<div className="flex items-center gap-3">
					<button type="button" onClick={handleBack} aria-label="뒤로 가기">
						<svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<path d="M15 5l-7 7 7 7" />
						</svg>
					</button>
					<h1 className="text-lg font-bold">{booking.counterpartName}</h1>
					<Menu>
						<MenuButton aria-label="더보기 메뉴" className="ml-auto">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
								<circle cx="5" cy="12" r="1.8" />
								<circle cx="12" cy="12" r="1.8" />
								<circle cx="19" cy="12" r="1.8" />
							</svg>
						</MenuButton>
						<MenuItems
							anchor="bottom end"
							className="bg-surface z-20 mt-1 w-36 rounded-xl p-1 shadow-lg">
							<MenuItem>
								<button
									type="button"
									onClick={function () {
										setIsReportOpen(true);
									}}
									className="text-error-500 data-focus:bg-surface-alt w-full rounded-lg px-3 py-2.5 text-left text-sm">
									신고하기
								</button>
							</MenuItem>
							<MenuItem>
								<button
									type="button"
									onClick={function () {
										setIsBlockOpen(true);
									}}
									className="text-body data-focus:bg-surface-alt w-full rounded-lg px-3 py-2.5 text-left text-sm">
									차단하기
								</button>
							</MenuItem>
						</MenuItems>
					</Menu>
				</div>
				<Link
					href="/bookings"
					className="bg-surface-alt flex items-center justify-between rounded-xl px-3.5 py-2.5">
					<span className="text-sub text-xs tabular-nums">
						{formatBookingPeriod(booking.starts_at, booking.ends_at)} · {booking.place}
					</span>
					<span className="text-trust text-xs font-semibold">
						{BOOKING_STATUS_LABELS[booking.status]}
					</span>
				</Link>
			</header>

			<div className="grow px-5 py-4 pb-28">
				<p className="bg-warning-100 text-warning-700 mb-4 rounded-xl px-3.5 py-2.5 text-center text-xs">
					대화는 안전을 위해 저장되며 삭제할 수 없어요 · 조건만남 유도 시 제재됩니다
				</p>
				<ChatRoomMessageList
					messages={messages ?? []}
					myProfileId={profile.id}
					onReportClick={function () {
						setIsReportOpen(true);
					}}
				/>
			</div>

			<form
				onSubmit={handleSubmit}
				className="border-line bg-surface/80 fixed bottom-0 left-1/2 z-10 flex w-full max-w-md -translate-x-1/2 flex-col gap-2 border-t px-4 pt-3 pb-6 backdrop-blur-xl">
				{bannedPhrase !== null && (
					<p className="text-error-500 text-xs">
						&lsquo;{bannedPhrase}&rsquo; 표현이 포함된 메시지는 보낼 수 없어요. 조건만남 유도 등
						금지 행위는 제재 대상입니다.
					</p>
				)}
				<div className="flex items-center gap-2">
					<input
						value={content}
						onChange={function (event) {
							setContent(event.target.value);
							setBannedPhrase(null);
						}}
						placeholder="메시지 보내기"
						maxLength={2000}
						className="bg-surface-alt text-body placeholder:text-sub h-11 grow rounded-full px-4 text-[15px] focus:outline-none"
					/>
					<button
						type="submit"
						disabled={content.trim().length === 0 || sendMessageMutation.isPending}
						aria-label="보내기"
						className="bg-brand flex size-11 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-40">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
						</svg>
					</button>
				</div>
			</form>

			{isReportOpen && (
				<ReportDialog
					onClose={function () {
						setIsReportOpen(false);
					}}
					targetId={booking.counterpartId}
					targetNickname={booking.counterpartName}
				/>
			)}

			{isBlockOpen && (
				<BlockConfirmDialog
					onClose={function () {
						setIsBlockOpen(false);
					}}
					targetId={booking.counterpartId}
					targetNickname={booking.counterpartName}
				/>
			)}
		</div>
	);
}
