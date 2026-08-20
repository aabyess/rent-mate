// features/admin/components/AdminDashboard/AdminDashboardReportSection.tsx
"use client";

import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useUpdateReportStatusMutation } from "@/features/admin/mutations";
import { useReportsQuery } from "@/features/admin/queries";
import type { ReportStatus } from "@/features/admin/types";
import { REPORT_STATUS_LABELS } from "@/features/admin/utils";

const STATUS_BADGE_VARIANTS: Record<ReportStatus, "warning" | "trust" | "neutral"> = {
	open: "warning",
	resolved: "trust",
	dismissed: "neutral",
};

export function AdminDashboardReportSection(): JSX.Element {
	const { data: reports, isPending, isError } = useReportsQuery();
	const updateStatusMutation = useUpdateReportStatusMutation();

	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-[17px] font-semibold">신고 내역</h2>
			{isPending && <div className="bg-surface-alt h-28 animate-pulse rounded-2xl" />}
			{isError && <p className="text-sub py-6 text-center text-sm">목록을 불러오지 못했어요.</p>}
			{reports && reports.length === 0 && (
				<p className="bg-surface-alt text-sub rounded-2xl px-4 py-6 text-center text-sm">
					접수된 신고가 없어요.
				</p>
			)}
			{reports &&
				reports.map(function (report) {
					return (
						<article
							key={report.id}
							className="bg-surface-alt flex flex-col gap-2.5 rounded-2xl p-4">
							<div className="flex items-center justify-between">
								<span className="text-sm font-semibold">
									{report.reporterName} → {report.targetName}
								</span>
								<Badge variant={STATUS_BADGE_VARIANTS[report.status]}>
									{REPORT_STATUS_LABELS[report.status]}
								</Badge>
							</div>
							<p className="text-sub text-sm leading-relaxed">{report.reason}</p>
							{report.status === "open" && (
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										fullWidth
										isLoading={updateStatusMutation.isPending}
										onClick={function () {
											updateStatusMutation.mutate({ reportId: report.id, status: "dismissed" });
										}}>
										기각
									</Button>
									<Button
										size="sm"
										fullWidth
										isLoading={updateStatusMutation.isPending}
										onClick={function () {
											updateStatusMutation.mutate({ reportId: report.id, status: "resolved" });
										}}>
										조치 완료
									</Button>
								</div>
							)}
						</article>
					);
				})}
		</section>
	);
}
