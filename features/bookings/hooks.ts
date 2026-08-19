// features/bookings/hooks.ts
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { BOOKINGS_QUERY_KEYS } from "@/features/bookings/queries";
import type { BookingStatus } from "@/features/bookings/types";
import { createClient } from "@/libs/supabase/client";
import { useToastStore } from "@/store/useToastStore";

const STATUS_TOAST_MESSAGES: Partial<Record<BookingStatus, string>> = {
	accepted: "예약이 확정됐어요! 채팅으로 인사해보세요",
	rejected: "예약이 거절됐어요",
	completed: "데이트가 완료 처리됐어요. 후기를 남겨보세요",
};

// 내 예약의 생성·상태 변경을 실시간 수신해 토스트 + 목록 갱신
export function useBookingRealtimeNotifications(myUserId: string): void {
	const queryClient = useQueryClient();
	const showToast = useToastStore(function (state) {
		return state.showToast;
	});

	useEffect(
		function () {
			if (myUserId === "") {
				return;
			}
			const supabase = createClient();

			function invalidateBookings(): void {
				void queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.myList });
			}

			const channel = supabase
				.channel(`bookings-${myUserId}`)
				.on(
					"postgres_changes",
					{
						event: "INSERT",
						schema: "public",
						table: "bookings",
						filter: `partner_id=eq.${myUserId}`,
					},
					function () {
						showToast("새 예약 요청이 도착했어요");
						invalidateBookings();
					},
				)
				.on(
					"postgres_changes",
					{
						event: "UPDATE",
						schema: "public",
						table: "bookings",
						filter: `customer_id=eq.${myUserId}`,
					},
					function (payload) {
						const status = (payload.new as { status?: BookingStatus }).status;
						const message = status ? STATUS_TOAST_MESSAGES[status] : undefined;
						if (message) {
							showToast(message);
						}
						invalidateBookings();
					},
				)
				.subscribe();

			return function () {
				void supabase.removeChannel(channel);
			};
		},
		[myUserId, queryClient, showToast],
	);
}
