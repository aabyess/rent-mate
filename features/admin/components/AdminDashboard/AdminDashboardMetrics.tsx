// features/admin/components/AdminDashboard/AdminDashboardMetrics.tsx
"use client";

import type { JSX } from "react";
import { useAdminMetricsQuery } from "@/features/admin/queries";
import { getDaysElapsed } from "@/features/admin/utils";
import { cn } from "@/utils/cn";

type MetricCardProps = {
	label: string;
	value: number;
	oldestAt?: string | null;
	sectionId?: string;
};

function scrollToSection(sectionId: string): void {
	document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// 방치 기간 경고 기준 — 이 이상 오래되면 warning에서 error 톤으로 격상한다
const STALE_QUEUE_DAYS = 3;

// 처리할 일 — 0건이면 차분한 톤, 1건 이상이면 warning, 가장 오래된 항목이
// STALE_QUEUE_DAYS를 넘으면 error 톤으로 격상한다
function UrgentMetricCard({ label, value, oldestAt, sectionId }: MetricCardProps): JSX.Element {
	const isUrgent = value > 0;
	const daysElapsed = oldestAt ? getDaysElapsed(oldestAt) : 0;
	const isStale = isUrgent && daysElapsed > STALE_QUEUE_DAYS;

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
				isStale ? "bg-error-100" : isUrgent ? "bg-warning-500/15" : "bg-surface-alt",
			)}>
			<div className="flex items-center gap-1.5">
				<span
					className={cn(
						"text-xl font-bold tabular-nums",
						isStale ? "text-error-700" : isUrgent ? "text-warning-500" : "text-sub",
					)}>
					{value}
				</span>
				{isUrgent && oldestAt && (
					<span
						className={cn(
							"rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
							isStale ? "bg-error-500 text-white" : "text-warning-500 bg-warning-100",
						)}>
						최장 {daysElapsed}일
					</span>
				)}
			</div>
			<span
				className={cn(
					"text-xs",
					isStale ? "text-error-700" : isUrgent ? "text-warning-500" : "text-sub",
				)}>
				{label}
			</span>
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
			<div className="flex flex-col gap-2">
				<div className="grid grid-cols-2 gap-2">
					{Array.from({ length: 4 }, function (_, index) {
						return (
							<div key={index} className="bg-surface-alt h-[72px] animate-pulse rounded-2xl" />
						);
					})}
				</div>
				<div className="grid grid-cols-3 gap-2">
					{Array.from({ length: 3 }, function (_, index) {
						return (
							<div key={index} className="bg-surface-alt h-[72px] animate-pulse rounded-2xl" />
						);
					})}
				</div>
			</div>
		);
	}

	if (!metrics) {
		return <p className="text-sub py-6 text-center text-sm">지표를 불러오지 못했어요.</p>;
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="grid grid-cols-2 gap-2">
				<UrgentMetricCard
					label="승인 대기"
					value={metrics.pendingPartnerCount}
					oldestAt={metrics.pendingPartnerOldestAt}
					sectionId="admin-metrics-partners"
				/>
				<UrgentMetricCard
					label="미처리 신고"
					value={metrics.openReportCount}
					oldestAt={metrics.openReportOldestAt}
					sectionId="admin-metrics-reports"
				/>
				<UrgentMetricCard
					label="감지된 메시지"
					value={metrics.flaggedMessageCount}
					oldestAt={metrics.flaggedMessageOldestAt}
					sectionId="admin-metrics-flagged"
				/>
				<UrgentMetricCard
					label="안전 우려 후기"
					value={metrics.safetyFlaggedReviewCount}
					oldestAt={metrics.safetyFlaggedReviewOldestAt}
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
