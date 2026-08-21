// app/(main)/notifications/page.tsx
import type { JSX } from "react";
import { BackButton } from "@/components/commons/BackButton";
import { NotificationList } from "@/features/notifications/components/NotificationList";
import { NotificationMarkAllReadButton } from "@/features/notifications/components/NotificationMarkAllReadButton";

export default function NotificationsPage(): JSX.Element {
	return (
		<main className="flex flex-col gap-5 px-5 py-4 pb-16">
			<div className="flex items-center gap-3">
				<BackButton ariaLabel="이전 화면으로 돌아가기" />
				<h1 className="text-lg font-bold">알림</h1>
				<NotificationMarkAllReadButton />
			</div>
			<NotificationList />
		</main>
	);
}
