// features/bookings/apis.ts
import type {
	BookingRow,
	BookingStatus,
	BookingTimeRange,
	CreateBookingInput,
	MyBookingItem,
} from "@/features/bookings/types";
import { createClient } from "@/libs/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function postCreateBooking({
	partnerId,
	startsAt,
	endsAt,
	place,
	totalAmountKrw,
}: CreateBookingInput): Promise<string> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { data, error } = await supabase
		.from("bookings")
		.insert({
			customer_id: user.id,
			partner_id: partnerId,
			starts_at: startsAt,
			ends_at: endsAt,
			place,
			total_amount_krw: totalAmountKrw,
		})
		.select("id")
		.single();
	if (error) {
		throw error;
	}
	return (data as { id: string }).id;
}

export async function patchBookingStatus(bookingId: string, status: BookingStatus): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId);
	if (error) {
		throw error;
	}
}

// 예약 스케줄 화면에서 슬롯을 비활성화하기 위한, 해당 파트너의 확정된 시간대만 조회
export async function getPartnerAcceptedSlots(partnerId: string): Promise<BookingTimeRange[]> {
	const supabase = createClient();
	const { data, error } = await supabase.rpc("get_partner_accepted_slots", {
		p_partner_id: partnerId,
	});
	if (error) {
		throw error;
	}
	return (data ?? []) as BookingTimeRange[];
}

// 상대방 표시명: 내가 고객이면 파트너 닉네임, 내가 파트너면 고객 이름
async function attachCounterparts(
	supabase: SupabaseClient,
	myUserId: string,
	bookings: BookingRow[],
): Promise<MyBookingItem[]> {
	const partnerIds = bookings
		.filter(function (booking) {
			return booking.customer_id === myUserId;
		})
		.map(function (booking) {
			return booking.partner_id;
		});
	const customerIds = bookings
		.filter(function (booking) {
			return booking.partner_id === myUserId;
		})
		.map(function (booking) {
			return booking.customer_id;
		});

	const nicknameByProfileId = new Map<string, string>();
	if (partnerIds.length > 0) {
		const { data, error } = await supabase
			.from("partner_profiles")
			.select("profile_id, nickname")
			.in("profile_id", Array.from(new Set(partnerIds)));
		if (error) {
			throw error;
		}
		for (const row of (data ?? []) as { profile_id: string; nickname: string }[]) {
			nicknameByProfileId.set(row.profile_id, row.nickname);
		}
	}

	const nameByProfileId = new Map<string, string>();
	if (customerIds.length > 0) {
		const { data, error } = await supabase
			.from("profiles")
			.select("id, name")
			.in("id", Array.from(new Set(customerIds)));
		if (error) {
			throw error;
		}
		for (const row of (data ?? []) as { id: string; name: string }[]) {
			nameByProfileId.set(row.id, row.name);
		}
	}

	return bookings.map(function (booking) {
		const isReceived = booking.partner_id === myUserId;
		const counterpartId = isReceived ? booking.customer_id : booking.partner_id;
		const counterpartName = isReceived
			? (nameByProfileId.get(counterpartId) ?? "알 수 없음")
			: (nicknameByProfileId.get(counterpartId) ?? "알 수 없음");
		return { ...booking, isReceived, counterpartId, counterpartName };
	});
}

export async function getBookingDetail(bookingId: string): Promise<MyBookingItem | null> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return null;
	}

	const { data, error } = await supabase
		.from("bookings")
		.select(
			"id, customer_id, partner_id, starts_at, ends_at, place, status, total_amount_krw, created_at",
		)
		.eq("id", bookingId)
		.maybeSingle();
	if (error) {
		throw error;
	}
	if (!data) {
		return null;
	}

	const items = await attachCounterparts(supabase, user.id, [data as BookingRow]);
	return items[0] ?? null;
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
		.select(
			"id, customer_id, partner_id, starts_at, ends_at, place, status, total_amount_krw, created_at",
		)
		.or(`customer_id.eq.${user.id},partner_id.eq.${user.id}`)
		.order("starts_at", { ascending: false });
	if (error) {
		throw error;
	}
	const bookings = (data ?? []) as BookingRow[];
	if (bookings.length === 0) {
		return [];
	}

	return attachCounterparts(supabase, user.id, bookings);
}
