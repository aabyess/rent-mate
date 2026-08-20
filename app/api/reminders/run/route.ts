// app/api/reminders/run/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/libs/supabase/admin";

const REMINDER_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest): Promise<NextResponse> {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });
	}

	let admin;
	try {
		admin = createAdminClient();
	} catch {
		console.error("[reminders] SUPABASE_SERVICE_ROLE_KEY 미설정 — 리마인더 실행 실패");
		return NextResponse.json({ error: "config" }, { status: 500 });
	}

	const now = new Date();
	const windowEnd = new Date(now.getTime() + REMINDER_WINDOW_MS);
	const { data: bookings, error: bookingsError } = await admin
		.from("bookings")
		.select("id, customer_id, partner_id")
		.eq("status", "accepted")
		.gte("starts_at", now.toISOString())
		.lte("starts_at", windowEnd.toISOString());
	if (bookingsError) {
		console.error("[reminders] 예약 조회 실패", bookingsError.message);
		return NextResponse.json({ error: "query_failed" }, { status: 500 });
	}

	let sent = 0;
	for (const booking of bookings ?? []) {
		const recipientIds = [booking.customer_id, booking.partner_id];
		for (const recipientId of recipientIds) {
			const { error: insertError } = await admin.from("notifications").insert({
				recipient_id: recipientId,
				type: "booking_reminder",
				payload: { bookingId: booking.id },
			});
			// 23505 = unique_violation → 이미 오늘 보낸 리마인더, 정상적인 멱등 처리로 취급한다.
			if (!insertError) {
				sent += 1;
			} else if (insertError.code !== "23505") {
				console.error("[reminders] 알림 생성 실패", {
					bookingId: booking.id,
					recipientId,
					message: insertError.message,
				});
			}
		}
	}

	return NextResponse.json({ ok: true, checked: bookings?.length ?? 0, sent });
}
