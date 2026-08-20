// features/payouts/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { upsertMyPayoutAccount } from "@/features/payouts/apis";
import { PAYOUTS_QUERY_KEYS } from "@/features/payouts/queries";
import type { UpsertPayoutAccountInput } from "@/features/payouts/types";

export function useUpsertPayoutAccountMutation(): UseMutationResult<
	void,
	Error,
	UpsertPayoutAccountInput
> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: upsertMyPayoutAccount,
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: PAYOUTS_QUERY_KEYS.myAccount });
		},
	});
}
