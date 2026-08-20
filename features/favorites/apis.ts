// features/favorites/apis.ts
import type { BookmarkedPartner, FavoriteState } from "@/features/favorites/types";
import { createClient } from "@/libs/supabase/client";

export async function getMyFavoriteState(partnerId: string): Promise<FavoriteState> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return { isLiked: false, isBookmarked: false };
	}
	const [likeResult, bookmarkResult] = await Promise.all([
		supabase
			.from("partner_likes")
			.select("partner_id")
			.eq("partner_id", partnerId)
			.eq("customer_id", user.id)
			.maybeSingle(),
		supabase
			.from("partner_bookmarks")
			.select("partner_id")
			.eq("partner_id", partnerId)
			.eq("customer_id", user.id)
			.maybeSingle(),
	]);
	if (likeResult.error) {
		throw likeResult.error;
	}
	if (bookmarkResult.error) {
		throw bookmarkResult.error;
	}
	return { isLiked: likeResult.data !== null, isBookmarked: bookmarkResult.data !== null };
}

// 좋아요 개수는 security definer 함수로만 조회한다 (누가 눌렀는지는 비공개)
export async function getPartnerLikeCount(partnerId: string): Promise<number> {
	const supabase = createClient();
	const { data, error } = await supabase.rpc("get_partner_like_counts", {
		p_partner_ids: [partnerId],
	});
	if (error) {
		throw error;
	}
	const rows = (data ?? []) as { partner_id: string; like_count: number }[];
	return rows[0]?.like_count ?? 0;
}

async function toggleFavoriteRow(
	table: "partner_likes" | "partner_bookmarks",
	partnerId: string,
	isOn: boolean,
): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}
	if (isOn) {
		const { error } = await supabase
			.from(table)
			.delete()
			.eq("customer_id", user.id)
			.eq("partner_id", partnerId);
		if (error) {
			throw error;
		}
		return;
	}
	const { error } = await supabase.from(table).insert({
		customer_id: user.id,
		partner_id: partnerId,
	});
	// 23505 = 이미 있음(더블 탭 레이스) — 멱등 처리
	if (error && error.code !== "23505") {
		throw error;
	}
}

export async function toggleLike(partnerId: string, isLiked: boolean): Promise<void> {
	return toggleFavoriteRow("partner_likes", partnerId, isLiked);
}

export async function toggleBookmark(partnerId: string, isBookmarked: boolean): Promise<void> {
	return toggleFavoriteRow("partner_bookmarks", partnerId, isBookmarked);
}

export async function getMyBookmarkedPartners(): Promise<BookmarkedPartner[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("partner_bookmarks")
		.select(
			"created_at, partner:partner_profiles(profile_id, nickname, photo_urls, region, hourly_rate_krw, purpose_tags)",
		)
		.order("created_at", { ascending: false });
	if (error) {
		throw error;
	}
	// 비활성·미승인 전환된 파트너는 RLS로 임베드가 null이 된다 — 목록에서 제외
	return ((data ?? []) as unknown as { partner: BookmarkedPartner | null }[])
		.map(function (row) {
			return row.partner;
		})
		.filter(function (partner): partner is BookmarkedPartner {
			return partner !== null;
		});
}
