// features/bookings/components/MyBookingList/MyBookingListCancelDialog.tsx
"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { JSX } from "react";
import { Button } from "@/components/ui/Button";
import { useCancelBookingWithRefundMutation } from "@/features/bookings/mutations";
import type { MyBookingItem } from "@/features/bookings/types";
import {
	calculateCancellationQuote,
	formatBookingPeriod,
	getCancellationTier,
} from "@/features/bookings/utils";
import { formatKrw } from "@/features/partners/utils";

type MyBookingListCancelDialogProps = {
	booking: MyBookingItem;
	onClose: () => void;
};

export function MyBookingListCancelDialog({
	booking,
	onClose,
}: MyBookingListCancelDialogProps): JSX.Element {
	const cancelMutation = useCancelBookingWithRefundMutation();
	const tier = getCancellationTier(booking.starts_at);
	const quote = calculateCancellationQuote(booking.starts_at, booking.total_amount_krw);

	function handleCancelConfirm(): void {
		cancelMutation.mutate(booking.id);
	}

	return (
		<Dialog open onClose={onClose} className="relative z-30">
			<div className="fixed inset-0 bg-black/40" aria-hidden="true" />
			<div className="fixed inset-x-0 bottom-0">
				<DialogPanel className="bg-surface mx-auto flex w-full max-w-md flex-col gap-4 rounded-t-3xl px-5 pt-5 pb-8">
					{cancelMutation.isSuccess ? (
						<div className="flex flex-col gap-4">
							<DialogTitle className="text-lg font-semibold">예약이 취소됐어요</DialogTitle>
							{cancelMutation.data.hadPayment ? (
								<div className="bg-surface-alt flex flex-col gap-1.5 rounded-xl px-4 py-3 text-sm">
									<div className="flex items-center justify-between">
										<span className="text-sub">환불 금액</span>
										<span className="font-semibold tabular-nums">
											{formatKrw(cancelMutation.data.refundKrw)}
										</span>
									</div>
									{cancelMutation.data.feeKrw > 0 && (
										<div className="flex items-center justify-between">
											<span className="text-sub">취소 수수료</span>
											<span className="text-sub tabular-nums">
												{formatKrw(cancelMutation.data.feeKrw)}
											</span>
										</div>
									)}
								</div>
							) : (
								<p className="text-sub text-sm">결제 전 예약이라 수수료 없이 취소됐어요.</p>
							)}
							<Button fullWidth onClick={onClose}>
								확인
							</Button>
						</div>
					) : tier === "none" ? (
						<div className="flex flex-col gap-4">
							<DialogTitle className="text-lg font-semibold">취소할 수 없어요</DialogTitle>
							<p className="bg-surface-alt text-sub rounded-xl px-4 py-3 text-sm tabular-nums">
								{booking.counterpartName} ·{" "}
								{formatBookingPeriod(booking.starts_at, booking.ends_at)}
							</p>
							<p className="text-sub text-sm">
								이미 시작된 예약은 취소할 수 없어요. 문제가 있다면 신고 기능을 이용해주세요.
							</p>
							<Button fullWidth onClick={onClose}>
								돌아가기
							</Button>
						</div>
					) : (
						<div className="flex flex-col gap-4">
							<DialogTitle className="text-lg font-semibold">예약을 취소할까요?</DialogTitle>
							<p className="bg-surface-alt text-sub rounded-xl px-4 py-3 text-sm tabular-nums">
								{booking.counterpartName} ·{" "}
								{formatBookingPeriod(booking.starts_at, booking.ends_at)}
							</p>
							{quote.isFreeCancellation ? (
								<p className="text-sub text-sm">
									데이트 시작 24시간 전이라 수수료 없이 전액{" "}
									<span className="text-body font-semibold tabular-nums">
										{formatKrw(quote.refundKrw)}
									</span>{" "}
									환불돼요.
								</p>
							) : (
								<p className="text-sub text-sm">
									데이트 시작 24시간 이내 취소라 수수료{" "}
									<span className="text-body font-semibold tabular-nums">
										{formatKrw(quote.feeKrw)}
									</span>
									를 제외한{" "}
									<span className="text-body font-semibold tabular-nums">
										{formatKrw(quote.refundKrw)}
									</span>
									이 환불돼요.
								</p>
							)}
							{cancelMutation.isError && (
								<p className="text-error-500 text-sm">{cancelMutation.error.message}</p>
							)}
							<div className="flex gap-2">
								<Button variant="outline" fullWidth onClick={onClose}>
									돌아가기
								</Button>
								<Button
									fullWidth
									isLoading={cancelMutation.isPending}
									onClick={handleCancelConfirm}
									className="bg-error-500 hover:bg-error-700 active:bg-error-700">
									{cancelMutation.isPending ? "취소 중..." : "예약 취소"}
								</Button>
							</div>
						</div>
					)}
				</DialogPanel>
			</div>
		</Dialog>
	);
}
