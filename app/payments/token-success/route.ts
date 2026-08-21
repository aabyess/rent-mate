// app/payments/token-success/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/libs/supabase/admin";
import { createClient } from "@/libs/supabase/server";

function failRedirect(request: NextRequest, code: string): NextResponse {
	return NextResponse.redirect(new URL(`/payments/token-fail?code=${code}`, request.nextUrl));
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

	// 사전 검증: 세션 클라이언트는 RLS로 본인 구매만 조회되므로 소유자 확인을 겸한다.
	// confirm(토스 과금) 전에 걸러야, 검증 실패 시 과금만 되고 우리 기록은 없는 고아 결제를 막는다.
	const { data: purchase, error: purchaseError } = await supabase
		.from("token_purchases")
		.select("profile_id, amount_krw, status")
		.eq("id", orderId)
		.maybeSingle();
	if (purchaseError || !purchase) {
		return failRedirect(request, "purchase_not_found");
	}
	if (purchase.profile_id !== user.id || purchase.amount_krw !== amount) {
		return failRedirect(request, "amount_mismatch");
	}

	// 멱등 처리: successUrl 재방문(새로고침·뒤로가기)이면 이미 처리된 주문이라 confirm을 다시 부르지 않는다.
	// 실제로 재confirm하면 토스가 이미 승인된 paymentKey라 실패시켜 우리 쪽엔 정상 결제가 fail로 보이게 된다.
	if (purchase.status !== "pending") {
		return NextResponse.redirect(new URL("/wallet?purchase=success", request.nextUrl));
	}

	const secretKey = process.env.TOSS_SECRET_KEY;
	if (!secretKey) {
		return failRedirect(request, "config");
	}

	// 토스 결제 승인 — 금액·상품 조합은 grant_tokens에서 다시 한번 대조한다 (2차 방어)
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
		console.error("[payments] SUPABASE_SERVICE_ROLE_KEY 미설정 — 토큰 적립 실패", { orderId });
		return failRedirect(request, "config");
	}

	const { error } = await admin.rpc("grant_tokens", {
		p_purchase_id: orderId,
		p_profile_id: user.id,
		p_provider_payment_key: paymentKey,
		p_amount_krw: amount,
	});
	if (error) {
		console.error("[payments] 토큰 적립 실패", { orderId, message: error.message });
		return failRedirect(request, "record_failed");
	}

	return NextResponse.redirect(new URL("/wallet?purchase=success", request.nextUrl));
}
