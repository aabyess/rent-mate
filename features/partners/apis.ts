// features/partners/apis.ts
import type {
	CreatePartnerProfileInput,
	MyPartnerProfile,
	PartnerDetailItem,
	PartnerListItem,
	PatchPartnerProfileInput,
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
			"profile_id, nickname, bio, hourly_rate_krw, photo_urls, birth_year, height_cm, weight_kg, interests, available_weekdays, available_start_hour, available_end_hour, region, purpose_tags, gender, blog_greeting, blog_cover_url, qna, created_at, is_approved, is_active",
		)
		.eq("profile_id", user.id)
		.maybeSingle();
	if (error) {
		throw error;
	}
	return (data ?? null) as MyPartnerProfile | null;
}

// 본인 폴더({uid}/...)에만 업로드 가능 — storage RLS로 강제된다
async function uploadPartnerPhotos(userId: string, photos: File[]): Promise<string[]> {
	const supabase = createClient();
	const urls: string[] = [];
	for (const photo of photos) {
		const extension = photo.name.split(".").pop() ?? "jpg";
		const path = `${userId}/${crypto.randomUUID()}.${extension}`;
		const { error } = await supabase.storage.from("partner-photos").upload(path, photo);
		if (error) {
			throw error;
		}
		const { data } = supabase.storage.from("partner-photos").getPublicUrl(path);
		urls.push(data.publicUrl);
	}
	return urls;
}

export async function postCreatePartnerProfile({
	nickname,
	bio,
	hourlyRateKrw,
	birthYear,
	heightCm,
	weightKg,
	interests,
	availableWeekdays,
	availableStartHour,
	availableEndHour,
	photos,
	region,
	purposeTags,
	qna,
}: CreatePartnerProfileInput): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	// 파트너 성별은 온보딩에서 등록한 profiles.gender를 그대로 복사한다 — 폼에서 다시 묻지 않는다
	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("gender")
		.eq("id", user.id)
		.maybeSingle();
	if (profileError) {
		throw profileError;
	}
	if (!profile?.gender) {
		// 온보딩 이전 가입자 등 성별 정보가 없는 계정 — 별도 수정 화면이 아직 없어 고객센터로 안내한다
		throw new Error(
			"성별 정보가 등록되지 않아 파트너로 활동할 수 없어요. 고객센터로 문의해주세요.",
		);
	}

	const photoUrls = photos.length > 0 ? await uploadPartnerPhotos(user.id, photos) : [];

	const { error } = await supabase.from("partner_profiles").insert({
		profile_id: user.id,
		nickname,
		bio,
		hourly_rate_krw: hourlyRateKrw,
		birth_year: birthYear,
		height_cm: heightCm,
		weight_kg: weightKg,
		interests,
		available_weekdays: availableWeekdays,
		available_start_hour: availableStartHour,
		available_end_hour: availableEndHour,
		photo_urls: photoUrls,
		region,
		gender: profile.gender,
		purpose_tags: purposeTags,
		qna,
	});
	if (error) {
		throw error;
	}
}

export async function patchPartnerProfile({
	nickname,
	bio,
	hourlyRateKrw,
	heightCm,
	weightKg,
	interests,
	availableWeekdays,
	availableStartHour,
	availableEndHour,
	region,
	purposeTags,
	qna,
	existingPhotoUrls,
	newPhotos,
}: PatchPartnerProfileInput): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const uploadedUrls = newPhotos.length > 0 ? await uploadPartnerPhotos(user.id, newPhotos) : [];
	const photoUrls = [...existingPhotoUrls, ...uploadedUrls];

	// 제거된 기존 사진의 스토리지 파일 삭제는 v1에서 생략 — photo_urls 목록에서만 빠진다 (용량 정리는 후속 작업)
	const { error } = await supabase
		.from("partner_profiles")
		.update({
			nickname,
			bio,
			hourly_rate_krw: hourlyRateKrw,
			height_cm: heightCm,
			weight_kg: weightKg,
			interests,
			available_weekdays: availableWeekdays,
			available_start_hour: availableStartHour,
			available_end_hour: availableEndHour,
			photo_urls: photoUrls,
			region,
			purpose_tags: purposeTags,
			qna,
		})
		.eq("profile_id", user.id);
	if (error) {
		throw error;
	}
}

export async function getPartnerList(): Promise<PartnerListItem[]> {
	const supabase = createClient();

	// 이성 파트너만 노출 — 내 성별 정보가 없는 계정(구 가입자 등)은 필터 없이 전체 노출로 폴백한다
	const {
		data: { user },
	} = await supabase.auth.getUser();
	let oppositeGender: "male" | "female" | null = null;
	if (user) {
		const { data: myProfile } = await supabase
			.from("profiles")
			.select("gender")
			.eq("id", user.id)
			.maybeSingle();
		if (myProfile?.gender === "male") {
			oppositeGender = "female";
		} else if (myProfile?.gender === "female") {
			oppositeGender = "male";
		}
	}

	let query = supabase
		.from("partner_profiles")
		.select(
			"profile_id, nickname, bio, hourly_rate_krw, photo_urls, birth_year, height_cm, weight_kg, interests, available_weekdays, available_start_hour, available_end_hour, region, purpose_tags, gender, blog_greeting, blog_cover_url, qna, created_at",
		)
		.eq("is_approved", true)
		.eq("is_active", true);
	if (oppositeGender) {
		query = query.eq("gender", oppositeGender);
	}

	const { data, error } = await query.order("created_at", { ascending: false });
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
			"profile_id, nickname, bio, hourly_rate_krw, photo_urls, birth_year, height_cm, weight_kg, interests, available_weekdays, available_start_hour, available_end_hour, region, purpose_tags, gender, blog_greeting, blog_cover_url, qna, created_at",
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

export async function patchBlogGreeting(greeting: string): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const trimmed = greeting.trim();
	const { error } = await supabase
		.from("partner_profiles")
		.update({ blog_greeting: trimmed === "" ? null : trimmed })
		.eq("profile_id", user.id);
	if (error) {
		throw error;
	}
}

export async function patchBlogCover(photo: File): Promise<string> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const extension = photo.name.split(".").pop() ?? "jpg";
	const path = `${user.id}/cover-${crypto.randomUUID()}.${extension}`;
	const { error: uploadError } = await supabase.storage.from("partner-photos").upload(path, photo);
	if (uploadError) {
		throw uploadError;
	}
	const { data } = supabase.storage.from("partner-photos").getPublicUrl(path);

	const { error } = await supabase
		.from("partner_profiles")
		.update({ blog_cover_url: data.publicUrl })
		.eq("profile_id", user.id);
	if (error) {
		throw error;
	}
	return data.publicUrl;
}
