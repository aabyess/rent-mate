// features/sportsMate/apis.ts
import type {
	PatchSportsMatePostStatusInput,
	SportsMatePost,
	SportsMatePostInput,
} from "@/features/sportsMate/types";
import { createClient } from "@/libs/supabase/client";

const SPORTS_MATE_POST_COLUMNS =
	"id, author_id, author_name, sport, region, preferred_date, time_slot, gender_mode, comment, status, created_at";

// 모집 중인 글만 — 마감·매칭된 글은 탐색에서 빠진다
export async function getSportsMatePosts(): Promise<SportsMatePost[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("sports_mate_posts")
		.select(SPORTS_MATE_POST_COLUMNS)
		.eq("status", "open")
		.order("created_at", { ascending: false });
	if (error) {
		throw error;
	}
	return (data ?? []) as SportsMatePost[];
}

// 내 글은 상태 무관 전체 노출(마감된 것도 마이페이지에서 확인 가능해야 해서)
export async function getMySportsMatePosts(): Promise<SportsMatePost[]> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return [];
	}

	const { data, error } = await supabase
		.from("sports_mate_posts")
		.select(SPORTS_MATE_POST_COLUMNS)
		.eq("author_id", user.id)
		.order("created_at", { ascending: false });
	if (error) {
		throw error;
	}
	return (data ?? []) as SportsMatePost[];
}

export async function getSportsMatePost(postId: string): Promise<SportsMatePost | null> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("sports_mate_posts")
		.select(SPORTS_MATE_POST_COLUMNS)
		.eq("id", postId)
		.maybeSingle();
	if (error) {
		throw error;
	}
	return (data ?? null) as SportsMatePost | null;
}

// author_name은 서버 트리거가 profiles.name으로 덮어써서 여기서 보내는 값은 무시된다
export async function postCreateSportsMatePost({
	sport,
	region,
	preferredDate,
	timeSlot,
	genderMode,
	comment,
}: SportsMatePostInput): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { error } = await supabase.from("sports_mate_posts").insert({
		author_id: user.id,
		sport,
		region,
		preferred_date: preferredDate,
		time_slot: timeSlot,
		gender_mode: genderMode,
		comment,
	});
	if (error) {
		throw error;
	}
}

export async function patchSportsMatePost(
	postId: string,
	{ sport, region, preferredDate, timeSlot, genderMode, comment }: SportsMatePostInput,
): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase
		.from("sports_mate_posts")
		.update({
			sport,
			region,
			preferred_date: preferredDate,
			time_slot: timeSlot,
			gender_mode: genderMode,
			comment,
		})
		.eq("id", postId);
	if (error) {
		throw error;
	}
}

export async function patchSportsMatePostStatus({
	postId,
	status,
}: PatchSportsMatePostStatusInput): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase.from("sports_mate_posts").update({ status }).eq("id", postId);
	if (error) {
		throw error;
	}
}
