// features/notifications/apis.ts
import type { NotificationRow, NotifyEventInput } from "@/features/notifications/types";
import { createClient } from "@/libs/supabase/client";

export async function getMyNotifications(): Promise<NotificationRow[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("notifications")
		.select("id, recipient_id, type, payload, read_at, created_at")
		.order("created_at", { ascending: false })
		.limit(50);
	if (error) {
		throw error;
	}
	return (data ?? []) as NotificationRow[];
}

export async function getUnreadNotificationCount(): Promise<number> {
	const supabase = createClient();
	const { count, error } = await supabase
		.from("notifications")
		.select("id", { count: "exact", head: true })
		.is("read_at", null);
	if (error) {
		throw error;
	}
	return count ?? 0;
}

export async function patchMarkNotificationRead(notificationId: string): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase
		.from("notifications")
		.update({ read_at: new Date().toISOString() })
		.eq("id", notificationId);
	if (error) {
		throw error;
	}
}

export async function patchMarkAllNotificationsRead(): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase
		.from("notifications")
		.update({ read_at: new Date().toISOString() })
		.is("read_at", null);
	if (error) {
		throw error;
	}
}

// 실제 쓰기는 서버 라우트가 admin 클라이언트로 처리한다 (CLAUDE.md: 남의 행에 쓰는 작업).
// best-effort — 실패해도 호출부(예약/후기 작업)를 막지 않고 콘솔에만 남긴다.
export async function postNotifyEvent(input: NotifyEventInput): Promise<void> {
	try {
		const response = await fetch("/api/notifications", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(input),
		});
		if (!response.ok) {
			console.error("[notifications] 알림 생성 실패", input.type, await response.text());
		}
	} catch (error) {
		console.error("[notifications] 알림 생성 요청 실패", input.type, error);
	}
}
