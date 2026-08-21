// features/dateShare/mutations.ts
"use client";

import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { postCreateOrReuseDateShareLink } from "@/features/dateShare/apis";
import type { DateShareLink } from "@/features/dateShare/types";

export function useCreateDateShareLinkMutation(): UseMutationResult<DateShareLink, Error, string> {
	return useMutation({
		mutationFn: postCreateOrReuseDateShareLink,
	});
}
