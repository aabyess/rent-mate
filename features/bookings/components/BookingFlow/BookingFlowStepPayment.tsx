// features/bookings/components/BookingFlow/BookingFlowStepPayment.tsx
"use client";

import type { JSX } from "react";
import { formatKrw } from "@/features/partners/utils";

type BookingFlowStepPaymentProps = {
	totalPriceKrw: number;
};

export function BookingFlowStepPayment({
	totalPriceKrw,
}: BookingFlowStepPaymentProps): JSX.Element {
	return (
		<div className="flex flex-col gap-6">
			<section className="flex flex-col gap-3">
				<h2 className="text-[17px] font-semibold">결제 수단</h2>
				<div className="bg-surface-alt flex items-center justify-between rounded-2xl px-4 py-4">
					<span className="text-[15px] font-medium">모의 결제 (개발용)</span>
					<span className="bg-brand-subtle text-primary-600 rounded-full px-2.5 py-1 text-xs font-semibold">
						선택됨
					</span>
				</div>
				<p className="text-sub text-xs">
					아직 실제 결제(PG)는 연결돼 있지 않아요. 결제하기를 누르면 예약 요청이 바로 접수됩니다.
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-[17px] font-semibold">에스크로 안내</h2>
				<div className="bg-secondary-50 text-secondary-700 flex flex-col gap-2 rounded-2xl px-4 py-4 text-[13px] leading-relaxed">
					<p>
						결제 금액 {formatKrw(totalPriceKrw)}은 RentMate가 안전하게 보관하고, 데이트가 완료된 뒤
						파트너에게 정산돼요.
					</p>
					<p>데이트 시작 24시간 전까지는 전액 환불받을 수 있어요.</p>
				</div>
			</section>
		</div>
	);
}
