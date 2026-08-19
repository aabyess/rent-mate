// features/auth/apis.ts
import type {
	CreateProfileInput,
	MyProfile,
	SignInInput,
	SignUpInput,
} from "@/features/auth/types";
import { toAuthEmail } from "@/features/auth/utils";
import { createClient } from "@/libs/supabase/client";

export async function postSignUp({ username, password }: SignUpInput): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase.auth.signUp({ email: toAuthEmail(username), password });
	if (error) {
		throw error;
	}
}

export async function postSignIn({ username, password }: SignInInput): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase.auth.signInWithPassword({
		email: toAuthEmail(username),
		password,
	});
	if (error) {
		throw error;
	}
}

export async function postSignOut(): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase.auth.signOut();
	if (error) {
		throw error;
	}
}

export async function getMyProfile(): Promise<MyProfile | null> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return null;
	}

	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user.id)
		.maybeSingle();
	if (error) {
		throw error;
	}
	return (data ?? null) as MyProfile | null;
}

// 성인인증 게이트: 온보딩에서 연 나이 검증을 통과한 경우에만 호출된다
export async function postCreateProfile({ name }: Pick<CreateProfileInput, "name">): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { error } = await supabase.from("profiles").insert({
		id: user.id,
		name,
		adult_verified_at: new Date().toISOString(),
	});
	if (error) {
		throw error;
	}
}
