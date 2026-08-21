// features/inquiries/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { patchInquiryAnswer, postCreateInquiry } from "@/features/inquiries/apis";
import { INQUIRIES_QUERY_KEYS } from "@/features/inquiries/queries";
import type { CreateInquiryInput } from "@/features/inquiries/types";

export function useCreateInquiryMutation(): UseMutationResult<void, Error, CreateInquiryInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCreateInquiry,
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: INQUIRIES_QUERY_KEYS.myList });
		},
	});
}

type AnswerInput = {
	inquiryId: string;
	answer: string;
};

export function useAnswerInquiryMutation(): UseMutationResult<void, Error, AnswerInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: function ({ inquiryId, answer }: AnswerInput) {
			return patchInquiryAnswer(inquiryId, answer);
		},
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: INQUIRIES_QUERY_KEYS.adminList });
		},
	});
}
