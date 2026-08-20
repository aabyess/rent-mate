// features/bookings/components/MyBookingList/MyBookingListCancelDialog.tsx
"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { JSX } from "react";
import { Button } from "@/components/ui/Button";
import { useUpdateBookingStatusMutation } from "@/features/bookings/mutations";
import type { MyBookingItem } from "@/features/bookings/types";
import { formatBookingPeriod } from "@/features/bookings/utils";

type MyBookingListCancelDialogProps = {
	booking: MyBookingItem;
	onClose: () => void;
};

export function MyBookingListCancelDialog({
	booking,
	onClose,
}: MyBookingListCancelDialogProps): JSX.Element {
	const updateStatusMutation = useUpdateBookingStatusMutation();

	function handleCancelConfirm(): void {
		updateStatusMutation.mutate(
			{ bookingId: booking.id, status: "canceled" },
			{
				onSuccess: function (): void {
					onClose();
				},
			},
		);
	}

	return (
		<Dialog open onClose={onClose} className="relative z-30">
			<div className="fixed inset-0 bg-black/40" aria-hidden="true" />
			<div className="fixed inset-x-0 bottom-0">
				<DialogPanel className="bg-surface mx-auto flex w-full max-w-md flex-col gap-4 rounded-t-3xl px-5 pt-5 pb-8">
					<DialogTitle className="text-lg font-semibold">예약을 취소할까요?</DialogTitle>
					<p className="bg-surface-alt text-sub rounded-xl px-4 py-3 text-sm tabular-nums">
						{booking.counterpartName} · {formatBookingPeriod(booking.starts_at, booking.ends_at)}
					</p>
					<p className="text-sub text-sm">
						데이트 시작 24시간 전까지는 전액 환불돼요. 이후 취소는 환불이 제한될 수 있어요.
					</p>
					{updateStatusMutation.isError && (
						<p className="text-error-500 text-sm">{updateStatusMutation.error.message}</p>
					)}
					<div className="flex gap-2">
						<Button variant="outline" fullWidth onClick={onClose}>
							돌아가기
						</Button>
						<Button
							fullWidth
							isLoading={updateStatusMutation.isPending}
							onClick={handleCancelConfirm}
							className="bg-error-500 hover:bg-error-700 active:bg-error-700">
							{updateStatusMutation.isPending ? "취소 중..." : "예약 취소"}
						</Button>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
}
