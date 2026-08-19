// features/reviews/apis.ts
import type {
	CreateReviewInput,
	MyReviewItem,
	PartnerRatingSummary,
	ReviewRow,
} from "@/features/reviews/types";
import { createClient } from "@/libs/supabase/client";

export async function postCreateReview({
	bookingId,
	partnerId,
	rating,
	content,
}: CreateReviewInput): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { error } = await supabase.from("reviews").insert({
		booking_id: bookingId,
		partner_id: partnerId,
		author_id: user.id,
		rating,
		content,
	});
	if (error) {
		throw error;
	}
}

export async function getPartnerReviews(partnerId: string): Promise<ReviewRow[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("reviews")
		.select("id, booking_id, partner_id, author_id, rating, content, created_at")
		.eq("partner_id", partnerId)
		.order("created_at", { ascending: false });
	if (error) {
		throw error;
	}
	return (data ?? []) as ReviewRow[];
}

export async function getMyReviews(): Promise<MyReviewItem[]> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return [];
	}

	const { data, error } = await supabase
		.from("reviews")
		.select("id, booking_id, partner_id, author_id, rating, content, created_at")
		.eq("author_id", user.id)
		.order("created_at", { ascending: false });
	if (error) {
		throw error;
	}
	const reviews = (data ?? []) as ReviewRow[];
	if (reviews.length === 0) {
		return [];
	}

	const { data: partners, error: partnersError } = await supabase
		.from("partner_profiles")
		.select("profile_id, nickname")
		.in(
			"profile_id",
			Array.from(
				new Set(
					reviews.map(function (review) {
						return review.partner_id;
					}),
				),
			),
		);
	if (partnersError) {
		throw partnersError;
	}
	const nicknameByProfileId = new Map(
		((partners ?? []) as { profile_id: string; nickname: string }[]).map(function (partner) {
			return [partner.profile_id, partner.nickname] as const;
		}),
	);

	return reviews.map(function (review) {
		return {
			...review,
			partnerNickname: nicknameByProfileId.get(review.partner_id) ?? "알 수 없음",
		};
	});
}

export async function getMyReviewedBookingIds(): Promise<string[]> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return [];
	}

	const { data, error } = await supabase
		.from("reviews")
		.select("booking_id")
		.eq("author_id", user.id);
	if (error) {
		throw error;
	}
	return ((data ?? []) as { booking_id: string }[]).map(function (row) {
		return row.booking_id;
	});
}

export async function getPartnerRatingSummaries(
	partnerIds: string[],
): Promise<Record<string, PartnerRatingSummary>> {
	if (partnerIds.length === 0) {
		return {};
	}
	const supabase = createClient();
	const { data, error } = await supabase
		.from("reviews")
		.select("partner_id, rating")
		.in("partner_id", partnerIds);
	if (error) {
		throw error;
	}

	const summaries: Record<string, { total: number; count: number }> = {};
	for (const row of (data ?? []) as { partner_id: string; rating: number }[]) {
		summaries[row.partner_id] ??= { total: 0, count: 0 };
		summaries[row.partner_id].total += row.rating;
		summaries[row.partner_id].count += 1;
	}
	return Object.fromEntries(
		Object.entries(summaries).map(function ([partnerId, { total, count }]) {
			return [partnerId, { average: Math.round((total / count) * 10) / 10, count }];
		}),
	);
}
