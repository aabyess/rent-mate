// features/bookings/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { postCreateBooking } from "@/features/bookings/apis";
import { BOOKINGS_QUERY_KEYS } from "@/features/bookings/queries";
import type { CreateBookingInput } from "@/features/bookings/types";

export function useCreateBookingMutation(): UseMutationResult<void, Error, CreateBookingInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCreateBooking,
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.myList });
		},
	});
}
