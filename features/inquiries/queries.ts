// features/inquiries/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getAdminInquiries, getMyInquiries } from "@/features/inquiries/apis";
import type { AdminInquiryItem, InquiryRow } from "@/features/inquiries/types";

export const INQUIRIES_QUERY_KEYS = {
	myList: ["inquiries", "myList"] as const,
	adminList: ["inquiries", "adminList"] as const,
};

export function useMyInquiriesQuery(): UseQueryResult<InquiryRow[]> {
	return useQuery({
		queryKey: INQUIRIES_QUERY_KEYS.myList,
		queryFn: getMyInquiries,
	});
}

export function useAdminInquiriesQuery(): UseQueryResult<AdminInquiryItem[]> {
	return useQuery({
		queryKey: INQUIRIES_QUERY_KEYS.adminList,
		queryFn: getAdminInquiries,
	});
}
