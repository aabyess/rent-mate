// features/chats/components/ChatRoomList/index.tsx
"use client";

import Link from "next/link";
import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { useMyBookingsQuery } from "@/features/bookings/queries";
import { BOOKING_STATUS_LABELS, formatBookingPeriod } from "@/features/bookings/utils";
import { useChatRoomSummariesQuery } from "@/features/chats/queries";
import { formatChatListTime } from "@/features/chats/utils";
import { useMyBlocksQuery } from "@/features/safety/queries";

export function ChatRoomList(): JSX.Element {
	const { data: bookings, isPending, isError } = useMyBookingsQuery();
	const { data: blocks, isPending: isBlocksPending } = useMyBlocksQuery();

	const blockedIds = new Set(
		(blocks ?? []).map(function (block) {
			return block.blocked_id;
		}),
	);
	const rooms = (bookings ?? []).filter(function (booking) {
		return (
			booking.status !== "canceled" &&
			booking.status !== "rejected" &&
			!blockedIds.has(booking.counterpartId)
		);
	});
	const summariesQuery = useChatRoomSummariesQuery(
		rooms.map(function (room) {
			return room.id;
		}),
	);

	if (isPending || isBlocksPending) {
		return (
			<div className="flex flex-col gap-3">
				{Array.from({ length: 3 }, function (_, index) {
					return <div key={index} className="bg-surface-alt h-20 animate-pulse rounded-2xl" />;
				})}
			</div>
		);
	}

	if (isError) {
		return <p className="text-sub py-16 text-center text-sm">채팅 목록을 불러오지 못했어요.</p>;
	}

	const summaries = summariesQuery.data ?? {};
	const sortedRooms = [...rooms].sort(function (a, b) {
		const aTime = summaries[a.id]?.lastMessage?.created_at ?? a.created_at;
		const bTime = summaries[b.id]?.lastMessage?.created_at ?? b.created_at;
		return new Date(bTime).getTime() - new Date(aTime).getTime();
	});

	if (rooms.length === 0) {
		return (
			<div className="flex flex-col items-center gap-3 py-16">
				<p className="text-sub text-sm">예약이 생기면 채팅방이 열려요.</p>
				<Link href="/" className="text-brand text-sm font-medium underline">
					파트너 둘러보기
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2.5">
			{sortedRooms.map(function (booking) {
				return (
					<Link
						key={booking.id}
						href={`/chats/${booking.id}`}
						className="bg-surface flex items-center gap-3.5 rounded-2xl p-4">
						<div className="from-primary-100 to-primary-200 flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="#f26b4a" opacity="0.4">
								<circle cx="12" cy="8.5" r="3.6" />
								<path d="M4.5 21c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7z" />
							</svg>
						</div>
						<div className="flex min-w-0 grow flex-col gap-0.5">
							<div className="flex items-center gap-2">
								<span className="text-[15px] font-semibold">{booking.counterpartName}</span>
								<Badge
									variant={booking.status === "accepted" ? "trust" : "neutral"}
									className="shrink-0">
									{BOOKING_STATUS_LABELS[booking.status]}
								</Badge>
							</div>
							<span className="text-sub truncate text-[13px]">
								{summaries[booking.id]?.lastMessage?.content ??
									formatBookingPeriod(booking.starts_at, booking.ends_at)}
							</span>
						</div>
						<div className="ml-auto flex shrink-0 flex-col items-end gap-1">
							{summaries[booking.id]?.lastMessage && (
								<span className="text-sub text-xs tabular-nums">
									{formatChatListTime(summaries[booking.id].lastMessage!.created_at)}
								</span>
							)}
							{(summaries[booking.id]?.unreadCount ?? 0) > 0 && (
								<span className="bg-brand flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold text-white tabular-nums">
									{summaries[booking.id].unreadCount}
								</span>
							)}
						</div>
					</Link>
				);
			})}
		</div>
	);
}
