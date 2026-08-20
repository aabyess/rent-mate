// features/admin/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
	getFlaggedMessages,
	getPaymentsOverview,
	getPendingPartners,
	getReportContextContent,
	getReports,
} from "@/features/admin/apis";
import type {
	AdminPaymentItem,
	FlaggedMessageItem,
	PendingPartnerItem,
	ReportContext,
	ReportContextContent,
	ReportItem,
} from "@/features/admin/types";

export const ADMIN_QUERY_KEYS = {
	pendingPartners: ["admin", "pendingPartners"] as const,
	reports: ["admin", "reports"] as const,
	reportContext: function (context: ReportContext) {
		return ["admin", "reportContext", context.type, context.id] as const;
	},
	flaggedMessages: ["admin", "flaggedMessages"] as const,
	payments: ["admin", "payments"] as const,
};

export function usePaymentsOverviewQuery(): UseQueryResult<AdminPaymentItem[]> {
	return useQuery({
		queryKey: ADMIN_QUERY_KEYS.payments,
		queryFn: getPaymentsOverview,
	});
}

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

export function useReportContextQuery(
	context: ReportContext,
): UseQueryResult<ReportContextContent> {
	return useQuery({
		queryKey: ADMIN_QUERY_KEYS.reportContext(context),
		queryFn: function () {
			return getReportContextContent(context);
		},
	});
}
