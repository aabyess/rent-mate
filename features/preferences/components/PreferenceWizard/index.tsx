// features/preferences/components/PreferenceWizard/index.tsx
"use client";

import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { PreferenceWizardForm } from "@/features/preferences/components/PreferenceWizard/PreferenceWizardForm";
import { useMyPreferencesQuery } from "@/features/preferences/queries";

type PreferenceWizardProps = {
	isSignupFlow: boolean;
};

// 데이터 로드 후 폼을 마운트해 기존 취향이 초기값으로 들어가게 한다 (마이페이지 재진입 시 수정 모드)
export function PreferenceWizard({ isSignupFlow }: PreferenceWizardProps): JSX.Element {
	const router = useRouter();
	const { data: preferences, isPending } = useMyPreferencesQuery();

	if (isPending) {
		return (
			<div className="flex w-full max-w-sm flex-col gap-4">
				<div className="bg-surface-alt h-6 w-1/2 animate-pulse rounded" />
				<div className="bg-surface-alt h-72 animate-pulse rounded-3xl" />
			</div>
		);
	}

	function handleDone(): void {
		if (isSignupFlow) {
			router.replace("/intro");
			return;
		}
		router.back();
	}

	return (
		<PreferenceWizardForm
			isSignupFlow={isSignupFlow}
			initialPreferences={preferences ?? null}
			onDone={handleDone}
		/>
	);
}
