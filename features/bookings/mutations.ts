// features/bookings/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import {
	patchBookingStatus,
	postCancelBookingWithRefund,
	postCreateBooking,
} from "@/features/bookings/apis";
import { BOOKINGS_QUERY_KEYS } from "@/features/bookings/queries";
import type {
	BookingStatus,
	CancellationResult,
	CreateBookingInput,
} from "@/features/bookings/types";
import { postNotifyEvent } from "@/features/notifications/apis";
import type { BookingNotificationType } from "@/features/notifications/types";

export function useCreateBookingMutation(): UseMutationResult<string, Error, CreateBookingInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCreateBooking,
		async onSuccess(bookingId): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.myList });
			void postNotifyEvent({ type: "booking_requested", bookingId });
		},
	});
}

type UpdateBookingStatusInput = {
	bookingId: string;
	status: BookingStatus;
};

const STATUS_NOTIFICATION_TYPES: Partial<Record<BookingStatus, BookingNotificationType>> = {
	accepted: "booking_accepted",
	rejected: "booking_rejected",
	canceled: "booking_canceled",
};

export function useUpdateBookingStatusMutation(): UseMutationResult<
	void,
	Error,
	UpdateBookingStatusInput
> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: function ({ bookingId, status }: UpdateBookingStatusInput) {
			return patchBookingStatus(bookingId, status);
		},
		async onSuccess(_data, { bookingId, status }): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.myList }),
				queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.detail(bookingId) }),
			]);
			const notificationType = STATUS_NOTIFICATION_TYPES[status];
			if (notificationType) {
				void postNotifyEvent({ type: notificationType, bookingId });
			}
		},
	});
}

export function useCancelBookingWithRefundMutation(): UseMutationResult<
	CancellationResult,
	Error,
	string
> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCancelBookingWithRefund,
		async onSuccess(_data, bookingId): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.myList }),
				queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.detail(bookingId) }),
				queryClient.invalidateQueries({ queryKey: ["payments"] }),
			]);
			void postNotifyEvent({ type: "booking_canceled", bookingId });
		},
	});
}
