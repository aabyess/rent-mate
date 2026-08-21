// app/api/notifications/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/libs/supabase/admin";
import { createClient } from "@/libs/supabase/server";

const BOOKING_NOTIFICATION_TYPES = [
	"booking_requested",
	"booking_accepted",
	"booking_rejected",
	"booking_canceled",
	"review_received",
] as const;

const PARTNER_NOTIFICATION_TYPES = ["partner_approved", "partner_rejected"] as const;

// 크론(하루 1회)이 놓치는 24시간 미만 리마인더 구멍 방어용 — 크론과 동일한 창(window)
const REMINDER_WINDOW_MS = 24 * 60 * 60 * 1000;

type BookingNotificationType = (typeof BOOKING_NOTIFICATION_TYPES)[number];
type PartnerNotificationType = (typeof PARTNER_NOTIFICATION_TYPES)[number];

function isBookingNotificationType(value: unknown): value is BookingNotificationType {
	return (
		typeof value === "string" && (BOOKING_NOTIFICATION_TYPES as readonly string[]).includes(value)
	);
}

function isPartnerNotificationType(value: unknown): value is PartnerNotificationType {
	return (
		typeof value === "string" && (PARTNER_NOTIFICATION_TYPES as readonly string[]).includes(value)
	);
}

const EXPECTED_BOOKING_STATUS: Partial<Record<BookingNotificationType, string>> = {
	booking_accepted: "accepted",
	booking_rejected: "rejected",
	booking_canceled: "canceled",
};

async function handlePartnerNotification(
	type: PartnerNotificationType,
	partnerId: string | undefined,
	callerId: string,
	supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<NextResponse> {
	if (typeof partnerId !== "string") {
		return NextResponse.json({ error: "invalid_params" }, { status: 400 });
	}

	// 세션 클라이언트로 조회 — RLS로 본인 프로필 행은 항상 조회 가능하다.
	const { data: callerProfile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", callerId)
		.maybeSingle();
	if (callerProfile?.role !== "admin") {
		return NextResponse.json({ error: "forbidden" }, { status: 403 });
	}

	let admin;
	try {
		admin = createAdminClient();
	} catch {
		console.error("[notifications] SUPABASE_SERVICE_ROLE_KEY 미설정 — 알림 생성 실패", {
			type,
			partnerId,
		});
		return NextResponse.json({ error: "config" }, { status: 500 });
	}

	const { error: insertError } = await admin.from("notifications").insert({
		recipient_id: partnerId,
		type,
		payload: { partnerId },
	});
	if (insertError) {
		console.error("[notifications] 삽입 실패", { type, partnerId, message: insertError.message });
		return NextResponse.json({ error: "insert_failed" }, { status: 500 });
	}

	return NextResponse.json({ ok: true });
}

// 예약 당사자(고객·파트너 누구든) + status=accepted + 시작까지 24시간 미만일 때만
// 허용 — 클라 판단을 그대로 믿지 않고 서버가 3중 조건을 다시 검증한다.
// 통과하면 고객·파트너 양쪽에 리마인더를 보낸다(크론과 동일하게).
async function handleBookingReminder(
	bookingId: string,
	callerId: string,
	supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<NextResponse> {
	const { data: booking, error: bookingError } = await supabase
		.from("bookings")
		.select("customer_id, partner_id, status, starts_at")
		.eq("id", bookingId)
		.maybeSingle();
	if (bookingError || !booking) {
		return NextResponse.json({ error: "booking_not_found" }, { status: 404 });
	}
	if (booking.customer_id !== callerId && booking.partner_id !== callerId) {
		return NextResponse.json({ error: "forbidden" }, { status: 403 });
	}
	if (booking.status !== "accepted") {
		return NextResponse.json({ error: "status_mismatch" }, { status: 409 });
	}
	const msUntilStart = new Date(booking.starts_at).getTime() - Date.now();
	if (msUntilStart <= 0 || msUntilStart >= REMINDER_WINDOW_MS) {
		return NextResponse.json({ error: "not_in_window" }, { status: 409 });
	}

	let admin;
	try {
		admin = createAdminClient();
	} catch {
		console.error("[notifications] SUPABASE_SERVICE_ROLE_KEY 미설정 — 알림 생성 실패", {
			type: "booking_reminder",
			bookingId,
		});
		return NextResponse.json({ error: "config" }, { status: 500 });
	}

	// 한쪽 recipient가 이미 크론 등으로 중복이어도 다른 쪽 발송을 막지 않도록 개별 insert
	for (const recipientId of [booking.customer_id, booking.partner_id]) {
		const { error: insertError } = await admin.from("notifications").insert({
			recipient_id: recipientId,
			type: "booking_reminder",
			payload: { bookingId },
		});
		// 23505 = unique_violation → notifications_dedupe_idx에 걸린 중복, 정상적인 멱등 처리로 취급한다.
		if (insertError && insertError.code !== "23505") {
			console.error("[notifications] 삽입 실패", {
				type: "booking_reminder",
				bookingId,
				recipientId,
				message: insertError.message,
			});
		}
	}

	return NextResponse.json({ ok: true });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
	const body: unknown = await request.json().catch(function () {
		return null;
	});
	if (!body || typeof body !== "object" || !("type" in body)) {
		return NextResponse.json({ error: "invalid_params" }, { status: 400 });
	}
	const rawType = (body as { type: unknown }).type;

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });
	}

	if (isPartnerNotificationType(rawType)) {
		return handlePartnerNotification(
			rawType,
			(body as { partnerId?: unknown }).partnerId as string | undefined,
			user.id,
			supabase,
		);
	}

	if (rawType === "booking_reminder") {
		if (!("bookingId" in body) || typeof (body as { bookingId: unknown }).bookingId !== "string") {
			return NextResponse.json({ error: "invalid_params" }, { status: 400 });
		}
		return handleBookingReminder((body as { bookingId: string }).bookingId, user.id, supabase);
	}

	if (
		!isBookingNotificationType(rawType) ||
		!("bookingId" in body) ||
		typeof (body as { bookingId: unknown }).bookingId !== "string"
	) {
		return NextResponse.json({ error: "invalid_params" }, { status: 400 });
	}
	const type = rawType;
	const bookingId = (body as { bookingId: string }).bookingId;

	// 세션 클라이언트로 조회 — RLS 덕분에 이 예약과 무관한 사용자는 아예 조회되지 않는다.
	const { data: booking, error: bookingError } = await supabase
		.from("bookings")
		.select("customer_id, partner_id, status")
		.eq("id", bookingId)
		.maybeSingle();
	if (bookingError || !booking) {
		return NextResponse.json({ error: "booking_not_found" }, { status: 404 });
	}

	const expectedStatus = EXPECTED_BOOKING_STATUS[type];
	if (expectedStatus && booking.status !== expectedStatus) {
		return NextResponse.json({ error: "status_mismatch" }, { status: 409 });
	}

	let recipientId: string;
	if (type === "booking_requested" || type === "booking_canceled") {
		if (booking.customer_id !== user.id) {
			return NextResponse.json({ error: "forbidden" }, { status: 403 });
		}
		recipientId = booking.partner_id;
	} else if (type === "booking_accepted" || type === "booking_rejected") {
		if (booking.partner_id !== user.id) {
			return NextResponse.json({ error: "forbidden" }, { status: 403 });
		}
		recipientId = booking.customer_id;
	} else {
		const { data: review, error: reviewError } = await supabase
			.from("reviews")
			.select("author_id")
			.eq("booking_id", bookingId)
			.maybeSingle();
		if (reviewError || !review || review.author_id !== user.id) {
			return NextResponse.json({ error: "forbidden" }, { status: 403 });
		}
		recipientId = booking.partner_id;
	}

	let admin;
	try {
		admin = createAdminClient();
	} catch {
		console.error("[notifications] SUPABASE_SERVICE_ROLE_KEY 미설정 — 알림 생성 실패", {
			type,
			bookingId,
		});
		return NextResponse.json({ error: "config" }, { status: 500 });
	}

	const { error: insertError } = await admin.from("notifications").insert({
		recipient_id: recipientId,
		type,
		payload: { bookingId },
	});
	// 23505 = unique_violation → notifications_dedupe_idx에 걸린 중복 요청, 정상적인 멱등 처리로 취급한다.
	if (insertError && insertError.code !== "23505") {
		console.error("[notifications] 삽입 실패", { type, bookingId, message: insertError.message });
		return NextResponse.json({ error: "insert_failed" }, { status: 500 });
	}

	return NextResponse.json({ ok: true });
}
