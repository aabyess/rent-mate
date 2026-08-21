// features/safety/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import {
	deleteBlock,
	patchCancelReport,
	postCreateBlock,
	postCreateReport,
} from "@/features/safety/apis";
import { SAFETY_QUERY_KEYS } from "@/features/safety/queries";
import type { CreateBlockInput, CreateReportInput } from "@/features/safety/types";

export function useCreateReportMutation(): UseMutationResult<void, Error, CreateReportInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCreateReport,
		onSuccess: function (): void {
			void queryClient.invalidateQueries({ queryKey: SAFETY_QUERY_KEYS.myReports });
		},
	});
}

export function useCancelReportMutation(): UseMutationResult<void, Error, string> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patchCancelReport,
		onSuccess: function (): void {
			void queryClient.invalidateQueries({ queryKey: SAFETY_QUERY_KEYS.myReports });
		},
	});
}

export function useCreateBlockMutation(): UseMutationResult<void, Error, CreateBlockInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCreateBlock,
		onSuccess: function (): void {
			void queryClient.invalidateQueries({ queryKey: SAFETY_QUERY_KEYS.myBlocks });
		},
	});
}

export function useDeleteBlockMutation(): UseMutationResult<void, Error, string> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteBlock,
		onSuccess: function (): void {
			void queryClient.invalidateQueries({ queryKey: SAFETY_QUERY_KEYS.myBlocks });
		},
	});
}
