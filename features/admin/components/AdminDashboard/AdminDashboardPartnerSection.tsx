// features/admin/components/AdminDashboard/AdminDashboardPartnerSection.tsx
"use client";

import type { JSX } from "react";
import { AdminDashboardPartnerSectionCard } from "@/features/admin/components/AdminDashboard/AdminDashboardPartnerSectionCard";
import { useApprovePartnerMutation, useRejectPartnerMutation } from "@/features/admin/mutations";
import { usePendingPartnersQuery } from "@/features/admin/queries";

export function AdminDashboardPartnerSection(): JSX.Element {
	const { data: partners, isPending, isError } = usePendingPartnersQuery();
	const approveMutation = useApprovePartnerMutation();
	const rejectMutation = useRejectPartnerMutation();

	const isMutating = approveMutation.isPending || rejectMutation.isPending;

	return (
		<section className="flex flex-col gap-3">
			<div className="flex items-center gap-2">
				<h2 className="text-[17px] font-semibold">파트너 승인 대기</h2>
				{partners && partners.length > 0 && (
					<span className="text-sub text-xs">{partners.length}건 · 펼쳐서 확인 후 심사</span>
				)}
			</div>
			{isPending && <div className="bg-surface-alt h-28 animate-pulse rounded-2xl" />}
			{isError && <p className="text-sub py-6 text-center text-sm">목록을 불러오지 못했어요.</p>}
			{partners && partners.length === 0 && (
				<p className="bg-surface-alt text-sub rounded-2xl px-4 py-6 text-center text-sm">
					승인 대기 중인 파트너가 없어요.
				</p>
			)}
			{partners &&
				partners.map(function (partner) {
					return (
						<AdminDashboardPartnerSectionCard
							key={partner.profile_id}
							partner={partner}
							isMutating={isMutating}
							onApprove={function () {
								approveMutation.mutate(partner.profile_id);
							}}
							onReject={function () {
								rejectMutation.mutate(partner.profile_id);
							}}
						/>
					);
				})}
		</section>
	);
}
