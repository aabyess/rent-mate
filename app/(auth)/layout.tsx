// app/(auth)/layout.tsx
import type { JSX, ReactNode } from "react";

type AuthLayoutProps = {
	children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps): JSX.Element {
	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
			<div className="from-primary-50 to-secondary-50 via-bg absolute inset-0 bg-gradient-to-br" />
			<div className="bg-primary-200/40 absolute -top-24 -right-20 size-72 rounded-full blur-3xl" />
			<div className="bg-secondary-200/40 absolute -bottom-28 -left-24 size-80 rounded-full blur-3xl" />
			<div className="relative w-full max-w-sm">{children}</div>
		</main>
	);
}
