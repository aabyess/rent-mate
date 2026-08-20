// features/preferences/apis.ts
import type { CustomerPreferences, SavePreferencesInput } from "@/features/preferences/types";
import { createClient } from "@/libs/supabase/client";

export async function getMyPreferences(): Promise<CustomerPreferences | null> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return null;
	}
	const { data, error } = await supabase
		.from("customer_preferences")
		.select("profile_id, interests, regions, purposes, skipped_at, updated_at")
		.eq("profile_id", user.id)
		.maybeSingle();
	if (error) {
		throw error;
	}
	return data as CustomerPreferences | null;
}

export async function putMyPreferences({
	interests,
	regions,
	purposes,
}: SavePreferencesInput): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}
	const { error } = await supabase.from("customer_preferences").upsert({
		profile_id: user.id,
		interests,
		regions,
		purposes,
		skipped_at: null,
		updated_at: new Date().toISOString(),
	});
	if (error) {
		throw error;
	}
}

// "나중에 하기" — 빈 취향으로 스킵 기록만 남겨 가입 플로우에서 위저드를 다시 띄우지 않는다
export async function postSkipPreferences(): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}
	const { error } = await supabase.from("customer_preferences").upsert({
		profile_id: user.id,
		skipped_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	});
	if (error) {
		throw error;
	}
}
