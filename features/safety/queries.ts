// features/safety/queries.ts
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getMyBlocks, getMyReports } from "@/features/safety/apis";
import type { BlockedUserItem, MyReportItem } from "@/features/safety/types";

export const SAFETY_QUERY_KEYS = {
	myBlocks: ["safety", "myBlocks"] as const,
	myReports: ["safety", "myReports"] as const,
};

export function useMyBlocksQuery(): UseQueryResult<BlockedUserItem[]> {
	return useQuery({
		queryKey: SAFETY_QUERY_KEYS.myBlocks,
		queryFn: getMyBlocks,
	});
}

export function useMyReportsQuery(): UseQueryResult<MyReportItem[]> {
	return useQuery({
		queryKey: SAFETY_QUERY_KEYS.myReports,
		queryFn: getMyReports,
	});
}
