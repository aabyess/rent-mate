// features/auth/components/MyPageContent/MyPageContentMenuGroup.tsx
import Link from "next/link";
import type { JSX } from "react";
import { cn } from "@/utils/cn";

type MenuGroupItem = {
	label: string;
	labelClassName?: string;
	href?: string;
};

type MyPageContentMenuGroupProps = {
	title?: string;
	items: MenuGroupItem[];
};

const ITEM_CLASSNAME = "flex h-13 items-center gap-3 px-4.5 text-left";

function MenuGroupItemContent({ label, labelClassName }: MenuGroupItem): JSX.Element {
	return (
		<>
			<span className={cn("text-[15px]", labelClassName)}>{label}</span>
			<svg
				className="text-line ml-auto"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round">
				<path d="M9 5l7 7-7 7" />
			</svg>
		</>
	);
}

export function MyPageContentMenuGroup({ title, items }: MyPageContentMenuGroupProps): JSX.Element {
	return (
		<div className="bg-surface flex flex-col overflow-hidden rounded-2xl">
			{title && (
				<div className="bg-secondary-50 flex h-10 items-center px-4.5">
					<span className="text-secondary-700 text-xs font-bold tracking-wide">{title}</span>
				</div>
			)}
			{items.map(function (item) {
				if (item.href) {
					return (
						<Link key={item.label} href={item.href} className={ITEM_CLASSNAME}>
							<MenuGroupItemContent {...item} />
						</Link>
					);
				}
				return (
					<button key={item.label} type="button" className={ITEM_CLASSNAME}>
						<MenuGroupItemContent {...item} />
					</button>
				);
			})}
		</div>
	);
}
