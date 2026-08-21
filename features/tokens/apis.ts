// features/tokens/apis.ts
import type { TokenProduct } from "@/features/tokens/products";
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

// pending 상태의 구매 행을 먼저 만든다 — 이 행의 id를 토스 orderId로 사용한다
export async function postCreateTokenPurchase(product: TokenProduct): Promise<string> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { data, error } = await supabase
		.from("token_purchases")
		.insert({
			profile_id: user.id,
			product: product.code,
			amount_krw: product.amountKrw,
			tokens: product.tokens,
		})
		.select("id")
		.single();
	if (error) {
		throw error;
	}
	return data.id;
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
