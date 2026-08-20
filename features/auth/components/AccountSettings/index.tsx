// features/auth/components/AccountSettings/index.tsx
"use client";

import type { JSX } from "react";
import { AccountSettingsDeleteSection } from "@/features/auth/components/AccountSettings/AccountSettingsDeleteSection";
import { AccountSettingsPasswordForm } from "@/features/auth/components/AccountSettings/AccountSettingsPasswordForm";
import { AccountSettingsProfileForm } from "@/features/auth/components/AccountSettings/AccountSettingsProfileForm";
import { useMyProfileQuery, useMyUsernameQuery } from "@/features/auth/queries";

export function AccountSettings(): JSX.Element {
	const { data: profile, isPending } = useMyProfileQuery();
	const { data: username } = useMyUsernameQuery();

	if (isPending) {
		return (
			<div className="flex flex-col gap-4">
				<div className="bg-surface-alt h-10 animate-pulse rounded-xl" />
				<div className="bg-surface-alt h-24 animate-pulse rounded-xl" />
			</div>
		);
	}

	if (!profile) {
		return <p className="text-sub py-16 text-center text-sm">프로필을 불러오지 못했어요.</p>;
	}

	return (
		<div className="flex flex-col gap-7">
			{/* key: profile.id 변경 시(사실상 없음)에만 리마운트되어 폼 상태가 초기화된다 */}
			<AccountSettingsProfileForm key={profile.id} profile={profile} username={username ?? null} />
			<AccountSettingsPasswordForm />
			<AccountSettingsDeleteSection />
		</div>
	);
}
