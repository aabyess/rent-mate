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
	putHomeRegion,
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
		onSuccess(): void {
			// 다른 계정으로 로그인하면 이전 사용자의 캐시(파트너 홈·지갑 등)가 전부 무효 —
			// 개별 invalidate로는 누락이 생겨 "이전 계정 화면이 그대로 보이는" 버그가 났었다
			queryClient.clear();
		},
	});
}

export function useSignOutMutation(): UseMutationResult<void, Error, void> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postSignOut,
		onSuccess(): void {
			queryClient.clear();
		},
	});
}

export function useCreateProfileMutation(): UseMutationResult<void, Error, CreateProfileInput> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCreateProfile,
		async onSuccess(): Promise<void> {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.myProfile }),
				queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.myProfilePrivate }),
			]);
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

export function usePatchHomeRegionMutation(): UseMutationResult<void, Error, string> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: putHomeRegion,
		async onSuccess(): Promise<void> {
			await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.myProfilePrivate });
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
