// components/ui/Badge.tsx
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, JSX } from "react";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
	"inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
	{
		variants: {
			variant: {
				trust: "bg-secondary-50 text-secondary-700",
				accent: "bg-accent-500 text-white",
				neutral: "bg-surface-alt text-sub",
				warning: "bg-warning-100 text-warning-700",
				error: "bg-error-100 text-error-700",
			},
		},
		defaultVariants: {
			variant: "neutral",
		},
	},
);

type BadgeProps = ComponentPropsWithoutRef<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps): JSX.Element {
	return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
