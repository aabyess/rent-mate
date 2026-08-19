// features/bookings/apis.ts
import type { BookingRow, CreateBookingInput, MyBookingItem } from "@/features/bookings/types";
import { createClient } from "@/libs/supabase/client";

export async function postCreateBooking({
	partnerId,
	startsAt,
	endsAt,
	place,
	totalAmountKrw,
}: CreateBookingInput): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { error } = await supabase.from("bookings").insert({
		customer_id: user.id,
		partner_id: partnerId,
		starts_at: startsAt,
		ends_at: endsAt,
		place,
		total_amount_krw: totalAmountKrw,
	});
	if (error) {
		throw error;
	}
}

export async function getBookingDetail(bookingId: string): Promise<MyBookingItem | null> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("bookings")
		.select("id, partner_id, starts_at, ends_at, place, status, total_amount_krw, created_at")
		.eq("id", bookingId)
		.maybeSingle();
	if (error) {
		throw error;
	}
	if (!data) {
		return null;
	}
	const booking = data as BookingRow;

	const { data: partner, error: partnerError } = await supabase
		.from("partner_profiles")
		.select("nickname")
		.eq("profile_id", booking.partner_id)
		.maybeSingle();
	if (partnerError) {
		throw partnerError;
	}

	return {
		...booking,
		partnerNickname: (partner as { nickname: string } | null)?.nickname ?? "알 수 없음",
	};
}

export async function getMyBookings(): Promise<MyBookingItem[]> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return [];
	}

	const { data, error } = await supabase
		.from("bookings")
		.select("id, partner_id, starts_at, ends_at, place, status, total_amount_krw, created_at")
		.eq("customer_id", user.id)
		.order("starts_at", { ascending: false });
	if (error) {
		throw error;
	}
	const bookings = (data ?? []) as BookingRow[];
	if (bookings.length === 0) {
		return [];
	}

	// bookings.partner_id ↔ partner_profiles.profile_id는 직접 FK가 없어 2차 조회로 닉네임을 붙인다
	const partnerIds = Array.from(
		new Set(
			bookings.map(function (booking) {
				return booking.partner_id;
			}),
		),
	);
	const { data: partners, error: partnersError } = await supabase
		.from("partner_profiles")
		.select("profile_id, nickname")
		.in("profile_id", partnerIds);
	if (partnersError) {
		throw partnersError;
	}
	const nicknameByProfileId = new Map(
		(partners ?? []).map(function (partner: { profile_id: string; nickname: string }) {
			return [partner.profile_id, partner.nickname] as const;
		}),
	);

	return bookings.map(function (booking) {
		return {
			...booking,
			partnerNickname: nicknameByProfileId.get(booking.partner_id) ?? "알 수 없음",
		};
	});
}
