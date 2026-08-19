// features/safety/components/SafetyCenter/SafetyCenterReportList.tsx
"use client";

import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { useMyReportsQuery } from "@/features/safety/queries";
import type { ReportStatus } from "@/features/safety/types";
import { formatDateShort } from "@/features/safety/utils";

const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
	open: "접수됨",
	resolved: "조치 완료",
	dismissed: "기각",
};

const REPORT_STATUS_VARIANTS: Record<ReportStatus, "warning" | "trust" | "neutral"> = {
	open: "warning",
	resolved: "trust",
	dismissed: "neutral",
};

export function SafetyCenterReportList(): JSX.Element {
	const { data: reports, isPending, isError } = useMyReportsQuery();

	if (isPending) {
		return <div className="bg-surface-alt h-20 animate-pulse rounded-2xl" />;
	}

	if (isError) {
		return <p className="text-sub py-6 text-center text-sm">신고 내역을 불러오지 못했어요.</p>;
	}

	if (reports.length === 0) {
		return (
			<p className="bg-surface-alt text-sub rounded-2xl px-4 py-8 text-center text-sm">
				신고한 내역이 없어요.
			</p>
		);
	}

	return (
		<div className="bg-surface flex flex-col overflow-hidden rounded-2xl">
			{reports.map(function (report) {
				return (
					<div key={report.id} className="flex flex-col gap-1.5 px-4.5 py-3.5">
						<div className="flex items-center gap-2">
							<span className="truncate text-[15px] font-medium">{report.targetNickname}</span>
							<Badge variant={REPORT_STATUS_VARIANTS[report.status]} className="shrink-0">
								{REPORT_STATUS_LABELS[report.status]}
							</Badge>
							<span className="text-sub ml-auto shrink-0 text-xs tabular-nums">
								{formatDateShort(report.created_at)}
							</span>
						</div>
						<p className="text-sub line-clamp-2 text-sm">{report.reason}</p>
					</div>
				);
			})}
		</div>
	);
}
