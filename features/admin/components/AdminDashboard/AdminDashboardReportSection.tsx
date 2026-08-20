// features/admin/components/AdminDashboard/AdminDashboardReportSection.tsx
"use client";

import type { JSX } from "react";
import { AdminDashboardReportSectionCard } from "@/features/admin/components/AdminDashboard/AdminDashboardReportSectionCard";
import {
	useDeactivatePartnerMutation,
	useUpdateReportStatusMutation,
} from "@/features/admin/mutations";
import { useReportsQuery } from "@/features/admin/queries";
import type { ReportStatus } from "@/features/admin/types";

export function AdminDashboardReportSection(): JSX.Element {
	const { data: reports, isPending, isError } = useReportsQuery();
	const updateStatusMutation = useUpdateReportStatusMutation();
	const deactivatePartnerMutation = useDeactivatePartnerMutation();

	return (
		<section id="admin-metrics-reports" className="flex flex-col gap-3">
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
						<AdminDashboardReportSectionCard
							key={report.id}
							report={report}
							isUpdatingStatus={updateStatusMutation.isPending}
							isDeactivating={deactivatePartnerMutation.isPending}
							onUpdateStatus={function (status: ReportStatus, adminNote: string) {
								updateStatusMutation.mutate({ reportId: report.id, status, adminNote });
							}}
							onDeactivatePartner={function () {
								deactivatePartnerMutation.mutate(report.target_id);
							}}
						/>
					);
				})}
		</section>
	);
}
