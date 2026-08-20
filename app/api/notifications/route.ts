// app/api/notifications/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/libs/supabase/admin";
import { createClient } from "@/libs/supabase/server";

const NOTIFICATION_TYPES = [
	"booking_requested",
	"booking_accepted",
	"booking_rejected",
	"booking_canceled",
	"review_received",
] as const;

type NotificationType = (typeof NOTIFICATION_TYPES)[number];

function isNotificationType(value: unknown): value is NotificationType {
	return typeof value === "string" && (NOTIFICATION_TYPES as readonly string[]).includes(value);
}

const EXPECTED_BOOKING_STATUS: Partial<Record<NotificationType, string>> = {
	booking_accepted: "accepted",
	booking_rejected: "rejected",
	booking_canceled: "canceled",
};

export async function POST(request: NextRequest): Promise<NextResponse> {
	const body: unknown = await request.json().catch(() => null);
	if (
		!body ||
		typeof body !== "object" ||
		!("type" in body) ||
		!("bookingId" in body) ||
		!isNotificationType((body as { type: unknown }).type) ||
		typeof (body as { bookingId: unknown }).bookingId !== "string"
	) {
		return NextResponse.json({ error: "invalid_params" }, { status: 400 });
	}
	const type = (body as { type: NotificationType }).type;
	const bookingId = (body as { bookingId: string }).bookingId;

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });
	}

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
		console.error("[notifications] SUPABASE_SERVICE_ROLE_KEY 미설정 — 알림 생성 실패", { type, bookingId });
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
