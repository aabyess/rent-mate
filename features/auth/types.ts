// features/auth/types.ts

export type UserRole = "customer" | "partner" | "admin";

export type Gender = "male" | "female";

export type MyProfile = {
	id: string;
	role: UserRole;
	name: string;
	phone: string | null;
	phone_verified_at: string | null;
	adult_verified_at: string | null;
	birth_date: string | null;
	gender: Gender | null;
	created_at: string;
};

// profiles와 분리된 이유는 features/auth/apis.ts의 profile_private 관련 함수 주석 참고
// (예약 상대에게 노출되면 안 되는 민감 필드 전용 테이블 — 거주 권역이 여기 첫 필드다)
export type MyProfilePrivate = {
	profile_id: string;
	home_region: string | null;
};

export type SignUpInput = {
	username: string;
	password: string;
};

export type SignInInput = {
	username: string;
	password: string;
};

export type CreateProfileInput = {
	name: string;
	birthDate: string;
	gender: Gender;
	homeRegion: string | null;
};

export type PatchMyProfileInput = {
	name: string;
	gender: Gender;
};

export type ChangePasswordInput = {
	password: string;
};
