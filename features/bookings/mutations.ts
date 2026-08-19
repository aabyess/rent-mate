// features/bookings/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { patchBookingStatus, postCreateBooking } from "@/features/bookings/apis";
import { BOOKINGS_QUERY_KEYS } from "@/features/bookings/queries";
import type { BookingStatus, CreateBookingInput } from "@/features/bookings/types";

export function useCreateBookingMutation(): UseMutationResult<string, Error, CreateBookingInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCreateBooking,
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.myList });
		},
	});
}

type UpdateBookingStatusInput = {
	bookingId: string;
	status: BookingStatus;
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
		async onSuccess(_data, { bookingId }): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.myList }),
				queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.detail(bookingId) }),
			]);
		},
	});
}
