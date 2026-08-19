// app/payments/success/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/libs/supabase/admin";
import { createClient } from "@/libs/supabase/server";

function failRedirect(request: NextRequest, code: string): NextResponse {
	return NextResponse.redirect(new URL(`/payments/fail?code=${code}`, request.nextUrl));
}

export async function GET(request: NextRequest): Promise<NextResponse> {
	const paymentKey = request.nextUrl.searchParams.get("paymentKey");
	const orderId = request.nextUrl.searchParams.get("orderId");
	const amount = Number(request.nextUrl.searchParams.get("amount"));
	if (!paymentKey || !orderId || !Number.isInteger(amount) || amount <= 0) {
		return failRedirect(request, "invalid_params");
	}

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return NextResponse.redirect(new URL("/login", request.nextUrl));
	}

	const secretKey = process.env.TOSS_SECRET_KEY;
	if (!secretKey) {
		return failRedirect(request, "config");
	}

	// 토스 결제 승인 — 금액은 이후 RPC에서 예약 금액과 재대조한다 (위변조 방지)
	const confirmResponse = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
		method: "POST",
		headers: {
			Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ paymentKey, orderId, amount }),
	});
	if (!confirmResponse.ok) {
		return failRedirect(request, "confirm_failed");
	}

	let admin;
	try {
		admin = createAdminClient();
	} catch {
		console.error("[payments] SUPABASE_SERVICE_ROLE_KEY 미설정 — 승인 기록 실패", { orderId });
		return failRedirect(request, "config");
	}

	const { error } = await admin.rpc("approve_booking_payment", {
		p_booking_id: orderId,
		p_customer_id: user.id,
		p_provider_payment_key: paymentKey,
		p_amount_krw: amount,
	});
	if (error) {
		console.error("[payments] 승인 기록 실패", { orderId, message: error.message });
		return failRedirect(request, "record_failed");
	}

	return NextResponse.redirect(new URL("/bookings?payment=success", request.nextUrl));
}
