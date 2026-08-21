// features/admin/components/AdminDashboard/AdminDashboardReportSectionCard.tsx
"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { useState, type ChangeEvent, type JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AdminDashboardReportSectionContext } from "@/features/admin/components/AdminDashboard/AdminDashboardReportSectionContext";
import type { ReportItem, ReportStatus } from "@/features/admin/types";
import { parseReportContext, REPORT_STATUS_LABELS } from "@/features/admin/utils";

const STATUS_BADGE_VARIANTS: Record<ReportStatus, "warning" | "trust" | "neutral"> = {
	open: "warning",
	resolved: "trust",
	dismissed: "neutral",
	canceled: "neutral",
};

type AdminDashboardReportSectionCardProps = {
	report: ReportItem;
	isUpdatingStatus: boolean;
	isDeactivating: boolean;
	onUpdateStatus: (status: ReportStatus, adminNote: string) => void;
	onDeactivatePartner: () => void;
};

export function AdminDashboardReportSectionCard({
	report,
	isUpdatingStatus,
	isDeactivating,
	onUpdateStatus,
	onDeactivatePartner,
}: AdminDashboardReportSectionCardProps): JSX.Element {
	const [adminNote, setAdminNote] = useState(report.admin_note ?? "");
	const context = parseReportContext(report.reason);
	const isOpen = report.status === "open";

	function handleNoteChange(event: ChangeEvent<HTMLInputElement>): void {
		setAdminNote(event.target.value);
	}

	return (
		<Disclosure as="article" className="bg-surface-alt rounded-2xl">
			<DisclosureButton className="group flex w-full items-center justify-between gap-3 p-4 text-left">
				<div className="flex min-w-0 flex-col gap-1">
					<span className="text-sm font-semibold">
						{report.reporterName} → {report.targetName}
					</span>
					<p className="text-sub truncate text-sm">{report.reason}</p>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					<Badge variant={STATUS_BADGE_VARIANTS[report.status]}>
						{REPORT_STATUS_LABELS[report.status]}
					</Badge>
					<svg
						className="text-sub shrink-0 transition-transform group-data-open:rotate-180"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M6 9l6 6 6-6" />
					</svg>
				</div>
			</DisclosureButton>

			<DisclosurePanel className="flex flex-col gap-3 px-4 pb-4">
				<p className="text-body text-sm leading-relaxed whitespace-pre-wrap">{report.reason}</p>
				{context && <AdminDashboardReportSectionContext context={context} />}

				{report.targetIsPartner && (
					<Button
						variant="outline"
						size="sm"
						isLoading={isDeactivating}
						onClick={onDeactivatePartner}
						className="text-error-500 border-error-500">
						파트너 비활성화
					</Button>
				)}

				{isOpen ? (
					<>
						<Input placeholder="처리 메모 (선택)" value={adminNote} onChange={handleNoteChange} />
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								fullWidth
								isLoading={isUpdatingStatus}
								onClick={function () {
									onUpdateStatus("dismissed", adminNote);
								}}>
								기각
							</Button>
							<Button
								size="sm"
								fullWidth
								isLoading={isUpdatingStatus}
								onClick={function () {
									onUpdateStatus("resolved", adminNote);
								}}>
								조치 완료
							</Button>
						</div>
					</>
				) : (
					report.admin_note && (
						<p className="text-sub text-xs leading-relaxed">메모: {report.admin_note}</p>
					)
				)}
			</DisclosurePanel>
		</Disclosure>
	);
}
