// components/ui/Button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, JSX } from "react";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-xl font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				primary: "bg-brand text-white hover:bg-primary-600 active:bg-primary-700",
				secondary: "bg-trust text-white hover:bg-secondary-600 active:bg-secondary-700",
				outline: "border border-line bg-surface text-body hover:bg-surface-alt",
				ghost: "text-body hover:bg-surface-alt",
			},
			size: {
				sm: "h-9 px-3 text-sm",
				md: "h-12 px-4 text-base",
				lg: "h-13 px-5 text-base",
			},
			fullWidth: {
				true: "w-full",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "md",
		},
	},
);

type ButtonProps = ComponentPropsWithoutRef<"button"> & VariantProps<typeof buttonVariants>;

export function Button({
	className,
	variant,
	size,
	fullWidth,
	type = "button",
	...props
}: ButtonProps): JSX.Element {
	return (
		<button
			type={type}
			className={cn(buttonVariants({ variant, size, fullWidth }), className)}
			{...props}
		/>
	);
}
