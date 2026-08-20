// features/payouts/apis.ts
import type { PartnerPayoutAccount, UpsertPayoutAccountInput } from "@/features/payouts/types";
import { createClient } from "@/libs/supabase/client";

export async function getMyPayoutAccount(): Promise<PartnerPayoutAccount | null> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return null;
	}

	const { data, error } = await supabase
		.from("partner_payout_accounts")
		.select("partner_id, bank_name, account_holder, account_number, updated_at")
		.eq("partner_id", user.id)
		.maybeSingle();
	if (error) {
		throw error;
	}
	return (data ?? null) as PartnerPayoutAccount | null;
}

export async function upsertMyPayoutAccount(input: UpsertPayoutAccountInput): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { error } = await supabase.from("partner_payout_accounts").upsert({
		partner_id: user.id,
		bank_name: input.bankName,
		account_holder: input.accountHolder,
		account_number: input.accountNumber,
	});
	if (error) {
		throw error;
	}
}
