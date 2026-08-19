// features/partners/apis.ts
import type {
	CreatePartnerProfileInput,
	MyPartnerProfile,
	PartnerDetailItem,
	PartnerListItem,
} from "@/features/partners/types";
import { createClient } from "@/libs/supabase/client";

export async function getMyPartnerProfile(): Promise<MyPartnerProfile | null> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return null;
	}

	const { data, error } = await supabase
		.from("partner_profiles")
		.select(
			"profile_id, nickname, bio, hourly_rate_krw, photo_urls, birth_year, interests, created_at, is_approved, is_active",
		)
		.eq("profile_id", user.id)
		.maybeSingle();
	if (error) {
		throw error;
	}
	return (data ?? null) as MyPartnerProfile | null;
}

export async function postCreatePartnerProfile({
	nickname,
	bio,
	hourlyRateKrw,
	birthYear,
	interests,
}: CreatePartnerProfileInput): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { error } = await supabase.from("partner_profiles").insert({
		profile_id: user.id,
		nickname,
		bio,
		hourly_rate_krw: hourlyRateKrw,
		birth_year: birthYear,
		interests,
	});
	if (error) {
		throw error;
	}
}

export async function getPartnerList(): Promise<PartnerListItem[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("partner_profiles")
		.select(
			"profile_id, nickname, bio, hourly_rate_krw, photo_urls, birth_year, interests, created_at",
		)
		.eq("is_approved", true)
		.eq("is_active", true)
		.order("created_at", { ascending: false });
	if (error) {
		throw error;
	}
	return (data ?? []) as PartnerListItem[];
}

export async function getPartnerDetail(profileId: string): Promise<PartnerDetailItem | null> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("partner_profiles")
		.select(
			"profile_id, nickname, bio, hourly_rate_krw, photo_urls, birth_year, interests, created_at",
		)
		.eq("profile_id", profileId)
		.eq("is_approved", true)
		.eq("is_active", true)
		.maybeSingle();
	if (error) {
		throw error;
	}
	return (data ?? null) as PartnerDetailItem | null;
}
