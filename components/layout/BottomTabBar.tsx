// components/layout/BottomTabBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { JSX, ReactNode } from "react";
import { useUnreadChatTotal } from "@/features/chats/hooks";
import { cn } from "@/utils/cn";

type TabItem = {
	href: "/" | "/bookings" | "/chats" | "/me";
	label: string;
	icon: ReactNode;
};

const TAB_ITEMS: TabItem[] = [
	{
		href: "/",
		label: "탐색",
		icon: (
			<svg
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round">
				<circle cx="11" cy="11" r="7" />
				<path d="M16.5 16.5L21 21" />
			</svg>
		),
	},
	{
		href: "/bookings",
		label: "예약",
		icon: (
			<svg
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round">
				<rect x="3" y="5" width="18" height="16" rx="3" />
				<path d="M3 10h18M8 3v4M16 3v4" />
			</svg>
		),
	},
	{
		href: "/chats",
		label: "채팅",
		icon: (
			<svg
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round">
				<path d="M21 12a8 8 0 0 1-8 8H4l2-3.2A8 8 0 1 1 21 12z" />
			</svg>
		),
	},
	{
		href: "/me",
		label: "마이",
		icon: (
			<svg
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round">
				<circle cx="12" cy="8" r="4" />
				<path d="M5 21c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />
			</svg>
		),
	},
];

export function BottomTabBar(): JSX.Element {
	const pathname = usePathname();
	const unreadChatTotal = useUnreadChatTotal();

	return (
		<nav className="border-line bg-surface/80 fixed bottom-0 left-1/2 z-10 flex w-full max-w-md -translate-x-1/2 items-center border-t px-3 pt-2 pb-5 backdrop-blur-xl">
			{TAB_ITEMS.map(function (item) {
				const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
				return (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							"relative flex h-12 grow flex-col items-center justify-center gap-0.5",
							isActive ? "text-brand font-semibold" : "text-sub",
						)}>
						{item.icon}
						{item.href === "/chats" && unreadChatTotal > 0 && (
							<span className="bg-brand absolute top-1 left-1/2 flex h-4 min-w-4 translate-x-2 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white tabular-nums">
								{unreadChatTotal > 9 ? "9+" : unreadChatTotal}
							</span>
						)}
						<span className="text-[11px]">{item.label}</span>
					</Link>
				);
			})}
		</nav>
	);
}
