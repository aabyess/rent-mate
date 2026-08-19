// components/ui/Input.tsx
import type { ComponentPropsWithoutRef, JSX } from "react";
import { cn } from "@/utils/cn";

type InputProps = ComponentPropsWithoutRef<"input">;

export function Input({ className, ...props }: InputProps): JSX.Element {
	return (
		<input
			className={cn(
				"border-line bg-surface text-body h-12 w-full rounded-xl border px-4 text-base",
				"placeholder:text-sub",
				"focus:border-brand focus:outline-none",
				"disabled:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-60",
				className,
			)}
			{...props}
		/>
	);
}
