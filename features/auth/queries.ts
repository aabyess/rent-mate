// features/auth/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getMyProfile, getMyProfilePrivate, getMyUsername } from "@/features/auth/apis";
import type { MyProfile, MyProfilePrivate } from "@/features/auth/types";

export const AUTH_QUERY_KEYS = {
	myProfile: ["auth", "myProfile"] as const,
	myUsername: ["auth", "myUsername"] as const,
	myProfilePrivate: ["auth", "myProfilePrivate"] as const,
};

export function useMyProfileQuery(): UseQueryResult<MyProfile | null> {
	return useQuery({
		queryKey: AUTH_QUERY_KEYS.myProfile,
		queryFn: getMyProfile,
	});
}

export function useMyProfilePrivateQuery(): UseQueryResult<MyProfilePrivate | null> {
	return useQuery({
		queryKey: AUTH_QUERY_KEYS.myProfilePrivate,
		queryFn: getMyProfilePrivate,
	});
}

export function useMyUsernameQuery(): UseQueryResult<string | null> {
	return useQuery({
		queryKey: AUTH_QUERY_KEYS.myUsername,
		queryFn: getMyUsername,
	});
}
