// features/auth/components/MyPageContent/MyPageContentMenuGroup.tsx
import type { JSX } from "react";
import { cn } from "@/utils/cn";

type MenuGroupItem = {
	label: string;
	labelClassName?: string;
};

type MyPageContentMenuGroupProps = {
	title?: string;
	items: MenuGroupItem[];
};

export function MyPageContentMenuGroup({ title, items }: MyPageContentMenuGroupProps): JSX.Element {
	return (
		<div className="bg-surface flex flex-col overflow-hidden rounded-2xl">
			{title && (
				<div className="bg-secondary-50 flex h-10 items-center px-4.5">
					<span className="text-secondary-700 text-xs font-bold tracking-wide">{title}</span>
				</div>
			)}
			{items.map(function (item) {
				return (
					<button
						key={item.label}
						type="button"
						className="flex h-13 items-center gap-3 px-4.5 text-left">
						<span className={cn("text-[15px]", item.labelClassName)}>{item.label}</span>
						<svg
							className="ml-auto text-neutral-300"
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
					</button>
				);
			})}
		</div>
	);
}
