// app/(auth)/layout.tsx
import type { JSX, ReactNode } from "react";

type AuthLayoutProps = {
	children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps): JSX.Element {
	return (
		<main className="flex min-h-screen items-center justify-center px-4">
			<div className="w-full max-w-sm">{children}</div>
		</main>
	);
}
