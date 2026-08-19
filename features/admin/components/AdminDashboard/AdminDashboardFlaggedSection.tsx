// features/admin/components/AdminDashboard/AdminDashboardFlaggedSection.tsx
"use client";

import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { useFlaggedMessagesQuery } from "@/features/admin/queries";

function formatFlaggedAt(createdAt: string): string {
	const date = new Date(createdAt);
	return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function AdminDashboardFlaggedSection(): JSX.Element {
	const { data: messages, isPending, isError } = useFlaggedMessagesQuery();

	return (
		<section className="flex flex-col gap-3">
			<div className="flex items-center gap-2">
				<h2 className="text-[17px] font-semibold">금칙어 감지 메시지</h2>
				<span className="text-sub text-xs">최근 50건</span>
			</div>
			{isPending && <div className="bg-surface-alt h-24 animate-pulse rounded-2xl" />}
			{isError && <p className="text-sub py-6 text-center text-sm">목록을 불러오지 못했어요.</p>}
			{messages && messages.length === 0 && (
				<p className="bg-surface-alt text-sub rounded-2xl px-4 py-6 text-center text-sm">
					감지된 메시지가 없어요.
				</p>
			)}
			{messages &&
				messages.map(function (message) {
					return (
						<article
							key={message.id}
							className="bg-surface-alt flex flex-col gap-2 rounded-2xl p-4">
							<div className="flex items-center justify-between">
								<span className="text-sm font-semibold">{message.senderName}</span>
								<div className="flex items-center gap-2">
									<Badge variant="error">감지됨</Badge>
									<span className="text-sub text-xs tabular-nums">
										{formatFlaggedAt(message.created_at)}
									</span>
								</div>
							</div>
							<p className="bg-surface rounded-xl px-3.5 py-2.5 text-sm leading-relaxed break-words">
								{message.content}
							</p>
							<span className="text-sub text-xs">예약 ID: {message.booking_id}</span>
						</article>
					);
				})}
		</section>
	);
}
