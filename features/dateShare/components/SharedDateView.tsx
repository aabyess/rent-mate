// features/dateShare/components/SharedDateView.tsx
"use client";

import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { useSharedDateQuery } from "@/features/dateShare/queries";

type SharedDateViewProps = {
	token: string;
};

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function pad(value: number): string {
	return String(value).padStart(2, "0");
}

function formatSharedDateRange(startsAt: string, endsAt: string): string {
	const start = new Date(startsAt);
	const end = new Date(endsAt);
	const weekday = WEEKDAY_LABELS[start.getDay()];
	return `${start.getMonth() + 1}월 ${start.getDate()}일 (${weekday}) ${pad(start.getHours())}:${pad(start.getMinutes())} – ${pad(end.getHours())}:${pad(end.getMinutes())}`;
}

export function SharedDateView({ token }: SharedDateViewProps): JSX.Element {
	const { data, isPending, isError } = useSharedDateQuery(token);

	return (
		<div className="flex flex-col gap-5">
			<span className="text-brand block text-center text-[22px] font-bold tracking-tight">
				RentMate
			</span>

			{isPending && (
				<div className="bg-surface flex flex-col gap-4 rounded-3xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
					<div className="bg-surface-alt h-6 w-2/3 animate-pulse rounded" />
					<div className="bg-surface-alt h-20 animate-pulse rounded-2xl" />
				</div>
			)}

			{!isPending && (isError || data === null) && (
				<div className="bg-surface flex flex-col items-center gap-2 rounded-3xl p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
					<h1 className="text-lg font-bold">링크를 찾을 수 없어요</h1>
					<p className="text-sub text-sm">주소를 다시 확인해주세요.</p>
				</div>
			)}

			{!isPending && data && data.isExpired && (
				<div className="bg-surface flex flex-col items-center gap-2 rounded-3xl p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
					<h1 className="text-lg font-bold">만료된 링크예요</h1>
					<p className="text-sub text-sm">이 일정 공유 링크는 더 이상 유효하지 않아요.</p>
				</div>
			)}

			{!isPending && data && !data.isExpired && (
				<div className="bg-surface flex flex-col gap-4 rounded-3xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
					<h1 className="text-lg font-bold">{data.counterpartName}님의 데이트 일정</h1>
					<dl className="bg-surface-alt flex flex-col gap-2 rounded-2xl px-4 py-4 text-sm">
						<div className="flex items-center justify-between">
							<dt className="text-sub">일시</dt>
							<dd className="font-medium tabular-nums">
								{formatSharedDateRange(data.startsAt, data.endsAt)}
							</dd>
						</div>
						<div className="flex items-center justify-between">
							<dt className="text-sub">장소</dt>
							<dd className="font-medium">{data.place}</dd>
						</div>
					</dl>
					<div className="flex flex-wrap gap-2">
						<Badge variant="trust">실명인증</Badge>
						{data.isAdultVerified && <Badge variant="trust">성인인증</Badge>}
					</div>
					<p className="text-sub bg-brand-subtle rounded-xl px-4 py-3 text-xs leading-relaxed">
						RentMate 안전 기능으로 공유된 일정입니다. 데이트는 공개 장소에서만 진행돼요.
					</p>
				</div>
			)}
		</div>
	);
}
