// features/tokens/apis.ts
import { createClient } from "@/libs/supabase/client";

export async function getMyTokenBalance(): Promise<number> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return 0;
	}

	const { data, error } = await supabase
		.from("token_wallets")
		.select("balance")
		.eq("profile_id", user.id)
		.maybeSingle();
	if (error) {
		throw error;
	}
	return data?.balance ?? 0;
}

export async function postSpendToken(reason: string): Promise<number> {
	const supabase = createClient();
	const { data, error } = await supabase.rpc("spend_token", { p_reason: reason });
	if (error) {
		throw error;
	}
	return data as number;
}

export type TokenLedgerEntry = {
	id: string;
	amount: number;
	reason: string;
	created_at: string;
};

export async function getMyTokenLedger(): Promise<TokenLedgerEntry[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("token_ledger")
		.select("id, amount, reason, created_at")
		.order("created_at", { ascending: false })
		.limit(50);
	if (error) {
		throw error;
	}
	return (data ?? []) as TokenLedgerEntry[];
}
