// features/admin/components/AdminDashboard/index.tsx
"use client";

import type { JSX } from "react";
import { AdminDashboardFlaggedSection } from "@/features/admin/components/AdminDashboard/AdminDashboardFlaggedSection";
import { AdminDashboardPartnerSection } from "@/features/admin/components/AdminDashboard/AdminDashboardPartnerSection";
import { AdminDashboardReportSection } from "@/features/admin/components/AdminDashboard/AdminDashboardReportSection";

export function AdminDashboard(): JSX.Element {
	return (
		<div className="flex flex-col gap-7">
			<AdminDashboardPartnerSection />
			<AdminDashboardReportSection />
			<AdminDashboardFlaggedSection />
		</div>
	);
}
