// features/admin/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getPendingPartners, getReports } from "@/features/admin/apis";
import type { PendingPartnerItem, ReportItem } from "@/features/admin/types";

export const ADMIN_QUERY_KEYS = {
	pendingPartners: ["admin", "pendingPartners"] as const,
	reports: ["admin", "reports"] as const,
};

export function usePendingPartnersQuery(): UseQueryResult<PendingPartnerItem[]> {
	return useQuery({
		queryKey: ADMIN_QUERY_KEYS.pendingPartners,
		queryFn: getPendingPartners,
	});
}

export function useReportsQuery(): UseQueryResult<ReportItem[]> {
	return useQuery({
		queryKey: ADMIN_QUERY_KEYS.reports,
		queryFn: getReports,
	});
}
