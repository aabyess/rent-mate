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
};
