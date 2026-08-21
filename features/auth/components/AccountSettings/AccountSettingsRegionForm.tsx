// features/auth/components/AccountSettings/AccountSettingsRegionForm.tsx
"use client";

import type { JSX } from "react";
import { usePatchHomeRegionMutation } from "@/features/auth/mutations";
import { HomeRegionPicker } from "@/features/shared/components/HomeRegionPicker";
import { useToastStore } from "@/store/useToastStore";

type AccountSettingsRegionFormProps = {
	homeRegion: string | null;
};

// 고르는 즉시 저장 — 별도 저장 버튼 없음. 파트너에게는 절대 노출되지 않고 "내 주변만" 탐색
// 필터에만 쓰인다 (profile_private 테이블, RLS로 본인·admin만 select 가능).
export function AccountSettingsRegionForm({
	homeRegion,
}: AccountSettingsRegionFormProps): JSX.Element {
	const patchHomeRegionMutation = usePatchHomeRegionMutation();
	const showToast = useToastStore(function (state) {
		return state.showToast;
	});

	function handleSelect(region: string): void {
		patchHomeRegionMutation.mutate(region, {
			onSuccess: function (): void {
				showToast("내 지역이 저장됐어요");
			},
		});
	}

	return (
		<section className="flex flex-col gap-2">
			<span className="text-sm font-medium">내 지역</span>
			<p className="text-sub text-xs">
				정확한 위치는 저장하지 않고 권역 단위로만 저장돼요. 파트너에게는 공개되지 않아요.
			</p>
			<HomeRegionPicker value={homeRegion} onSelect={handleSelect} />
			{patchHomeRegionMutation.isError && (
				<p className="text-error-500 text-sm">{patchHomeRegionMutation.error.message}</p>
			)}
		</section>
	);
}
