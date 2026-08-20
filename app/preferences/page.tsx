// app/preferences/page.tsx
import type { JSX } from "react";
import { PreferenceWizard } from "@/features/preferences/components/PreferenceWizard";

type PreferencesPageProps = {
	searchParams: Promise<{ from?: string }>;
};

export default async function PreferencesPage({
	searchParams,
}: PreferencesPageProps): Promise<JSX.Element> {
	const { from } = await searchParams;
	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
			<div className="from-primary-50 to-secondary-50 via-bg absolute inset-0 bg-gradient-to-br" />
			<div className="bg-primary-200/40 absolute -top-24 -right-20 size-72 rounded-full blur-3xl" />
			<div className="bg-secondary-200/40 absolute -bottom-28 -left-24 size-80 rounded-full blur-3xl" />
			<div className="relative flex w-full justify-center">
				<PreferenceWizard isSignupFlow={from === "signup"} />
			</div>
		</main>
	);
}
