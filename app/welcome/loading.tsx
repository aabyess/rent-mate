// app/welcome/loading.tsx
import type { JSX } from "react";

export default function WelcomeLoading(): JSX.Element {
	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden">
			<div className="from-primary-50 to-secondary-50 via-bg absolute inset-0 bg-gradient-to-br" />
			<span className="text-brand relative animate-pulse text-4xl font-bold tracking-tight">
				RentMate
			</span>
		</main>
	);
}
