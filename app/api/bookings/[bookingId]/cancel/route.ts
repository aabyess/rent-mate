// app/api/bookings/[bookingId]/cancel/route.ts
import { NextResponse } from "next/server";
import { calculateCancellationQuote } from "@/features/bookings/utils";
import { createClient } from "@/libs/supabase/server";

type RouteParams = {
	params: Promise<{ bookingId: string }>;
};

// 취소·환불: ① 결제 게이트웨이 취소(있다면, 실패 시 여기서 중단) ② DB 상태 기록은
// cancel_booking_with_refund RPC에 위임 — RPC가 소유자·상태·시간 조건을 최종 검증한다.
export async function POST(_request: Request, { params }: RouteParams): Promise<NextResponse> {
	const { bookingId } = await params;
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
	}

	const { data: booking, error: bookingError } = await supabase
		.from("bookings")
		.select("starts_at, total_amount_krw")
		.eq("id", bookingId)
		.maybeSingle();
	if (bookingError || !booking) {
		return NextResponse.json({ error: "예약을 찾을 수 없습니다." }, { status: 404 });
	}

	const { data: payment } = await supabase
		.from("payments")
		.select("status, provider_payment_key")
		.eq("booking_id", bookingId)
		.maybeSingle();

	if (payment?.status === "paid") {
		const { refundKrw } = calculateCancellationQuote(booking.starts_at, booking.total_amount_krw);
		// 실계약 전환 시 여기서 토스 결제 취소 API를 호출한다 (payments/success의 confirm과 동일한
		// 서버 시크릿 키 패턴):
		//   POST https://api.tosspayments.com/v1/payments/{payment.provider_payment_key}/cancel
		//   body: { cancelReason: "고객 요청 취소", cancelAmount: refundKrw (부분취소 시에만 포함) }
		// 실패하면 즉시 에러 응답하고 아래 RPC를 호출하지 않아야 한다(환불 안 됐는데 DB만
		// refunded로 남는 걸 막기 위함). 지금은 테스트 키 환경이라 성공을 가정하고 스캐폴드만 둔다.
		void refundKrw;
	}

	const { data, error } = await supabase.rpc("cancel_booking_with_refund", {
		p_booking_id: bookingId,
	});
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}

	const result = (data as { fee_krw: number; refund_krw: number; had_payment: boolean }[])[0];
	return NextResponse.json({
		feeKrw: result?.fee_krw ?? 0,
		refundKrw: result?.refund_krw ?? 0,
		hadPayment: result?.had_payment ?? false,
	});
}
