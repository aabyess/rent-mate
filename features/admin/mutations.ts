// features/admin/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import {
	deletePartnerProfile,
	patchPartnerApproval,
	patchPaymentStatus,
	patchReportStatus,
} from "@/features/admin/apis";
import { ADMIN_QUERY_KEYS } from "@/features/admin/queries";
import type { ReportStatus } from "@/features/admin/types";
import { postNotifyEvent } from "@/features/notifications/apis";
import { PARTNERS_QUERY_KEYS } from "@/features/partners/queries";

export function useApprovePartnerMutation(): UseMutationResult<void, Error, string> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patchPartnerApproval,
		async onSuccess(_data, partnerId): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.pendingPartners }),
				queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.list }),
			]);
			void postNotifyEvent({ type: "partner_approved", partnerId });
		},
	});
}

export function useRejectPartnerMutation(): UseMutationResult<void, Error, string> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deletePartnerProfile,
		async onSuccess(_data, partnerId): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.pendingPartners });
			void postNotifyEvent({ type: "partner_rejected", partnerId });
		},
	});
}

type UpdatePaymentStatusInput = {
	paymentId: string;
	status: "released" | "refunded";
};

export function useUpdatePaymentStatusMutation(): UseMutationResult<
	void,
	Error,
	UpdatePaymentStatusInput
> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: function ({ paymentId, status }: UpdatePaymentStatusInput) {
			return patchPaymentStatus(paymentId, status);
		},
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.payments });
		},
	});
}

type UpdateReportStatusInput = {
	reportId: string;
	status: ReportStatus;
};

export function useUpdateReportStatusMutation(): UseMutationResult<
	void,
	Error,
	UpdateReportStatusInput
> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: function ({ reportId, status }: UpdateReportStatusInput) {
			return patchReportStatus(reportId, status);
		},
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.reports });
		},
	});
}
