// features/reviews/apis.ts
import type { CreateReviewInput, ReviewRow } from "@/features/reviews/types";
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
