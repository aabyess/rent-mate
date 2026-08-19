// features/admin/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getFlaggedMessages, getPendingPartners, getReports } from "@/features/admin/apis";
import type { FlaggedMessageItem, PendingPartnerItem, ReportItem } from "@/features/admin/types";

export const ADMIN_QUERY_KEYS = {
	pendingPartners: ["admin", "pendingPartners"] as const,
	reports: ["admin", "reports"] as const,
	flaggedMessages: ["admin", "flaggedMessages"] as const,
};

export function useFlaggedMessagesQuery(): UseQueryResult<FlaggedMessageItem[]> {
	return useQuery({
		queryKey: ADMIN_QUERY_KEYS.flaggedMessages,
		queryFn: getFlaggedMessages,
	});
}

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
