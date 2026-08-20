// features/admin/components/AdminDashboard/index.tsx
"use client";

import type { JSX } from "react";
import { AdminDashboardFlaggedSection } from "@/features/admin/components/AdminDashboard/AdminDashboardFlaggedSection";
import { AdminDashboardMetrics } from "@/features/admin/components/AdminDashboard/AdminDashboardMetrics";
import { AdminDashboardPartnerSection } from "@/features/admin/components/AdminDashboard/AdminDashboardPartnerSection";
import { AdminDashboardPaymentSection } from "@/features/admin/components/AdminDashboard/AdminDashboardPaymentSection";
import { AdminDashboardReportSection } from "@/features/admin/components/AdminDashboard/AdminDashboardReportSection";

export function AdminDashboard(): JSX.Element {
	return (
		<div className="flex flex-col gap-7">
			<AdminDashboardMetrics />
			<AdminDashboardPartnerSection />
			<AdminDashboardPaymentSection />
			<AdminDashboardReportSection />
			<AdminDashboardFlaggedSection />
		</div>
	);
}
