// features/dateShare/apis.ts
import type { DateShareLink, SharedDateDetails } from "@/features/dateShare/types";
import { createClient } from "@/libs/supabase/client";

const SHARE_LINK_EXPIRY_BUFFER_MS = 24 * 60 * 60 * 1000;

type SharedDateRow = {
	starts_at: string | null;
	ends_at: string | null;
	place: string | null;
	counterpart_name: string | null;
	is_adult_verified: boolean | null;
	is_expired: boolean;
};

// 유효 토큰이 아니면 null — 토큰 부재/오탈자와 만료를 구분해야 하는 UI는
// isExpired로 별도 처리한다 (null이면 "링크를 찾을 수 없어요").
export async function getSharedDate(token: string): Promise<SharedDateDetails | null> {
	const supabase = createClient();
	const { data, error } = await supabase.rpc("get_shared_date", { p_token: token });
	if (error) {
		throw error;
	}
	const row = ((data ?? []) as SharedDateRow[])[0];
	if (!row) {
		return null;
	}
	return {
		startsAt: row.starts_at ?? "",
		endsAt: row.ends_at ?? "",
		place: row.place ?? "",
		counterpartName: row.counterpart_name ?? "",
		isAdultVerified: row.is_adult_verified ?? false,
		isExpired: row.is_expired,
	};
}

// 이미 유효한(만료 안 된) 본인 링크가 있으면 재사용 — 없으면 새로 만든다.
// 만료는 예약 종료 시각 + 24시간.
export async function postCreateOrReuseDateShareLink(bookingId: string): Promise<DateShareLink> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const nowIso = new Date().toISOString();
	const { data: existing, error: existingError } = await supabase
		.from("date_share_links")
		.select("token, expires_at")
		.eq("booking_id", bookingId)
		.eq("created_by", user.id)
		.gt("expires_at", nowIso)
		.order("created_at", { ascending: false })
		.limit(1)
		.maybeSingle();
	if (existingError) {
		throw existingError;
	}
	if (existing) {
		return { token: existing.token, expiresAt: existing.expires_at };
	}

	const { data: booking, error: bookingError } = await supabase
		.from("bookings")
		.select("ends_at")
		.eq("id", bookingId)
		.maybeSingle();
	if (bookingError || !booking) {
		throw bookingError ?? new Error("예약을 찾을 수 없어요.");
	}
	const expiresAt = new Date(
		new Date(booking.ends_at).getTime() + SHARE_LINK_EXPIRY_BUFFER_MS,
	).toISOString();

	const { data: created, error: insertError } = await supabase
		.from("date_share_links")
		.insert({ booking_id: bookingId, created_by: user.id, expires_at: expiresAt })
		.select("token, expires_at")
		.single();
	if (insertError || !created) {
		throw insertError ?? new Error("공유 링크 생성에 실패했어요.");
	}
	return { token: created.token, expiresAt: created.expires_at };
}
