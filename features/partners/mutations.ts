// features/partners/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { postCreatePartnerProfile } from "@/features/partners/apis";
import { PARTNERS_QUERY_KEYS } from "@/features/partners/queries";
import type { CreatePartnerProfileInput } from "@/features/partners/types";

export function useCreatePartnerProfileMutation(): UseMutationResult<
	void,
	Error,
	CreatePartnerProfileInput
> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCreatePartnerProfile,
		async onSuccess(): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.myProfile }),
				queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.list }),
			]);
		},
	});
}
