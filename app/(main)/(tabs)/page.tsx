// app/(main)/(tabs)/page.tsx
import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { HomeSwitcher } from "@/features/partners/components/HomeSwitcher";

export default function HomePage(): JSX.Element {
	return (
		<main className="flex flex-col">
			<header className="bg-surface flex items-center justify-between px-5 pt-4 pb-3">
				<h1 className="text-brand text-[22px] font-bold tracking-tight">RentMate</h1>
				<div className="flex items-center gap-1.5">
					<Badge variant="trust">
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" />
							<path d="M9 12l2 2 4-4" />
						</svg>
						안전 정책
					</Badge>
					<NotificationBell />
				</div>
			</header>
			<HomeSwitcher />
		</main>
	);
}
