// features/safety/mutations.ts
"use client";

import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { postCreateReport } from "@/features/safety/apis";
import type { CreateReportInput } from "@/features/safety/types";

export function useCreateReportMutation(): UseMutationResult<void, Error, CreateReportInput> {
	return useMutation({ mutationFn: postCreateReport });
}
