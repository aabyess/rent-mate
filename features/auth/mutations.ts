// features/auth/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { postCreateProfile, postSignIn, postSignOut, postSignUp } from "@/features/auth/apis";
import { AUTH_QUERY_KEYS } from "@/features/auth/queries";
import type { CreateProfileInput, SignInInput, SignUpInput } from "@/features/auth/types";

export function useSignUpMutation(): UseMutationResult<void, Error, SignUpInput> {
	return useMutation({ mutationFn: postSignUp });
}

export function useSignInMutation(): UseMutationResult<void, Error, SignInInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postSignIn,
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.myProfile });
		},
	});
}

export function useSignOutMutation(): UseMutationResult<void, Error, void> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postSignOut,
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.myProfile });
		},
	});
}

export function useCreateProfileMutation(): UseMutationResult<void, Error, CreateProfileInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCreateProfile,
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.myProfile });
		},
	});
}
