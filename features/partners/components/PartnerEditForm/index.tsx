// features/partners/components/PartnerEditForm/index.tsx
"use client";

import Link from "next/link";
import type { JSX } from "react";
import { PartnerEditFormFields } from "@/features/partners/components/PartnerEditForm/PartnerEditFormFields";
import { useMyPartnerProfileQuery } from "@/features/partners/queries";

export function PartnerEditForm(): JSX.Element {
	const { data: profile, isPending } = useMyPartnerProfileQuery();

	if (isPending) {
		return (
			<div className="flex flex-col gap-4">
				<div className="bg-surface-alt h-10 animate-pulse rounded-xl" />
				<div className="bg-surface-alt h-24 animate-pulse rounded-xl" />
				<div className="bg-surface-alt h-24 animate-pulse rounded-xl" />
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="flex flex-col items-center gap-4 py-24">
				<p className="text-sub text-sm">아직 파트너로 등록하지 않았어요.</p>
				<Link href="/partner/register" className="text-brand font-medium underline">
					파트너 등록하러 가기
				</Link>
			</div>
		);
	}

	// key: profile_id 변경 시(사실상 없음)에만 리마운트되어 폼 상태가 초기화된다
	return <PartnerEditFormFields key={profile.profile_id} profile={profile} />;
}
