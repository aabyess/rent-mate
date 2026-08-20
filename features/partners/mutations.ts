// features/partners/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import {
	patchBlogCover,
	patchBlogGreeting,
	patchPartnerProfile,
	postCreatePartnerProfile,
} from "@/features/partners/apis";
import { PARTNERS_QUERY_KEYS } from "@/features/partners/queries";
import type {
	CreatePartnerProfileInput,
	PatchPartnerProfileInput,
} from "@/features/partners/types";
import { createClient } from "@/libs/supabase/client";

export function useCreatePartnerProfileMutation(): UseMutationResult<
	void,
	Error,
	CreatePartnerProfileInput
> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCreatePartnerProfile,
		async onSuccess(): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.myProfile }),
				queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.list }),
			]);
		},
	});
}

export function usePatchPartnerProfileMutation(): UseMutationResult<
	void,
	Error,
	PatchPartnerProfileInput
> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patchPartnerProfile,
		async onSuccess(): Promise<void> {
			const supabase = createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.myProfile }),
				queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.list }),
				...(user
					? [queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.detail(user.id) })]
					: []),
			]);
		},
	});
}

export function usePatchBlogGreetingMutation(): UseMutationResult<void, Error, string> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patchBlogGreeting,
		async onSuccess(): Promise<void> {
			const supabase = createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.myProfile }),
				...(user
					? [queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.detail(user.id) })]
					: []),
			]);
		},
	});
}

export function usePatchBlogCoverMutation(): UseMutationResult<string, Error, File> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patchBlogCover,
		async onSuccess(): Promise<void> {
			const supabase = createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.myProfile }),
				...(user
					? [queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.detail(user.id) })]
					: []),
			]);
		},
	});
}
