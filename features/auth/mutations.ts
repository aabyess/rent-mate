// features/auth/mutations.ts
"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import {
	patchMyProfile,
	postChangePassword,
	postDeleteAccount,
	postCreateProfile,
	postSignIn,
	postSignOut,
	postSignUp,
} from "@/features/auth/apis";
import { AUTH_QUERY_KEYS } from "@/features/auth/queries";
import type {
	ChangePasswordInput,
	CreateProfileInput,
	PatchMyProfileInput,
	SignInInput,
	SignUpInput,
} from "@/features/auth/types";
import { PARTNERS_QUERY_KEYS } from "@/features/partners/queries";

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

export function usePatchMyProfileMutation(): UseMutationResult<void, Error, PatchMyProfileInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: patchMyProfile,
		async onSuccess(): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.myProfile }),
				// 성별이 바뀌면 홈의 이성 필터 결과가 즉시 갱신돼야 한다
				queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.list }),
			]);
		},
	});
}

export function useChangePasswordMutation(): UseMutationResult<void, Error, ChangePasswordInput> {
	return useMutation({ mutationFn: postChangePassword });
}

export function useDeleteAccountMutation(): UseMutationResult<void, Error, void> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postDeleteAccount,
		onSuccess(): void {
			// 캐시에 남은 개인 데이터를 전부 비운다
			queryClient.clear();
		},
	});
}
