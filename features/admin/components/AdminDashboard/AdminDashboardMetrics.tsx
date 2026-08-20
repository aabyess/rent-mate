// features/admin/components/AdminDashboard/AdminDashboardMetrics.tsx
"use client";

import type { JSX } from "react";
import { useAdminMetricsQuery } from "@/features/admin/queries";
import { cn } from "@/utils/cn";

type MetricCardProps = {
	label: string;
	value: number;
	sectionId?: string;
};

function scrollToSection(sectionId: string): void {
	document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// 처리할 일 — 0건이면 차분한 톤, 1건 이상이면 warning 톤으로 강조
function UrgentMetricCard({ label, value, sectionId }: MetricCardProps): JSX.Element {
	const isUrgent = value > 0;

	function handleClick(): void {
		if (sectionId) {
			scrollToSection(sectionId);
		}
	}

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"flex flex-col gap-1 rounded-2xl px-3.5 py-3.5 text-left",
				isUrgent ? "bg-warning-500/15" : "bg-surface-alt",
			)}>
			<span
				className={cn(
					"text-xl font-bold tabular-nums",
					isUrgent ? "text-warning-500" : "text-sub",
				)}>
				{value}
			</span>
			<span className={cn("text-xs", isUrgent ? "text-warning-500" : "text-sub")}>{label}</span>
		</button>
	);
}

// 현황 지표 — 참고용이라 항상 차분한 톤, 탭해도 이동할 곳이 없어 비인터랙티브
function StatusMetricCard({ label, value }: MetricCardProps): JSX.Element {
	return (
		<div className="bg-surface flex flex-col gap-1 rounded-2xl px-3.5 py-3.5">
			<span className="text-body text-xl font-bold tabular-nums">{value}</span>
			<span className="text-sub text-xs">{label}</span>
		</div>
	);
}

export function AdminDashboardMetrics(): JSX.Element {
	const { data: metrics, isPending } = useAdminMetricsQuery();

	if (isPending) {
		return (
			<div className="grid grid-cols-3 gap-2">
				{Array.from({ length: 6 }, function (_, index) {
					return <div key={index} className="bg-surface-alt h-[72px] animate-pulse rounded-2xl" />;
				})}
			</div>
		);
	}

	if (!metrics) {
		return <p className="text-sub py-6 text-center text-sm">지표를 불러오지 못했어요.</p>;
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="grid grid-cols-3 gap-2">
				<UrgentMetricCard
					label="승인 대기"
					value={metrics.pendingPartnerCount}
					sectionId="admin-metrics-partners"
				/>
				<UrgentMetricCard
					label="미처리 신고"
					value={metrics.openReportCount}
					sectionId="admin-metrics-reports"
				/>
				<UrgentMetricCard
					label="감지된 메시지"
					value={metrics.flaggedMessageCount}
					sectionId="admin-metrics-flagged"
				/>
			</div>
			<div className="grid grid-cols-3 gap-2">
				<StatusMetricCard label="활동 파트너" value={metrics.activePartnerCount} />
				<StatusMetricCard label="오늘 가입" value={metrics.todaySignupCount} />
				<StatusMetricCard label="오늘 예약" value={metrics.todayBookingCount} />
			</div>
		</div>
	);
}
