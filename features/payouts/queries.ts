// features/payouts/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getMyPayoutAccount } from "@/features/payouts/apis";
import type { PartnerPayoutAccount } from "@/features/payouts/types";

export const PAYOUTS_QUERY_KEYS = {
	myAccount: ["payouts", "myAccount"] as const,
};

export function useMyPayoutAccountQuery(): UseQueryResult<PartnerPayoutAccount | null> {
	return useQuery({
		queryKey: PAYOUTS_QUERY_KEYS.myAccount,
		queryFn: getMyPayoutAccount,
	});
}
