// features/auth/apis.ts
import type {
	ChangePasswordInput,
	CreateProfileInput,
	MyProfile,
	MyProfilePrivate,
	PatchMyProfileInput,
	SignInInput,
	SignUpInput,
} from "@/features/auth/types";
import { fromAuthEmail, toAuthEmail } from "@/features/auth/utils";
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

// 성인인증 게이트: 연 나이 검증과 adult_verified_at 세팅은 DB 트리거가 강제한다
export async function postCreateProfile({
	name,
	birthDate,
	gender,
	homeRegion,
}: CreateProfileInput): Promise<void> {
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
		birth_date: birthDate,
		gender,
	});
	if (error) {
		throw error;
	}

	if (homeRegion !== null) {
		const { error: regionError } = await supabase
			.from("profile_private")
			.insert({ profile_id: user.id, home_region: homeRegion });
		if (regionError) {
			throw regionError;
		}
	}
}

// 예약 상대에게 노출되면 안 되는 민감 필드 전용 테이블 — RLS로 본인·admin만 select 가능
// (profiles는 profiles_select_booking_counterpart 정책 때문에 예약 성립 상대에게 행 전체가
// 보여서 여기 넣으면 안 된다)
export async function getMyProfilePrivate(): Promise<MyProfilePrivate | null> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return null;
	}

	const { data, error } = await supabase
		.from("profile_private")
		.select("profile_id, home_region")
		.eq("profile_id", user.id)
		.maybeSingle();
	if (error) {
		throw error;
	}
	return (data ?? null) as MyProfilePrivate | null;
}

export async function putHomeRegion(homeRegion: string): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { error } = await supabase
		.from("profile_private")
		.upsert({ profile_id: user.id, home_region: homeRegion });
	if (error) {
		throw error;
	}
}

export async function getMyUsername(): Promise<string | null> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user?.email) {
		return null;
	}
	return fromAuthEmail(user.email);
}

// birth_date/adult_verified_at은 DB 트리거가 변경을 막는다 — name/gender만 대상
export async function patchMyProfile({ name, gender }: PatchMyProfileInput): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { error } = await supabase.from("profiles").update({ name, gender }).eq("id", user.id);
	if (error) {
		throw error;
	}
}

export async function postChangePassword({ password }: ChangePasswordInput): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase.auth.updateUser({ password });
	if (error) {
		throw error;
	}
}

// 회원 탈퇴 — 소프트 삭제·로그인 차단·세션 종료까지 서버 라우트가 처리한다
export async function postDeleteAccount(): Promise<void> {
	const response = await fetch("/api/account/delete", { method: "POST" });
	if (!response.ok) {
		const body = (await response.json().catch(function () {
			return null;
		})) as { error?: string } | null;
		throw new Error(body?.error ?? "탈퇴 처리에 실패했어요.");
	}
}
