// features/admin/components/AdminDashboard/AdminDashboardPartnerSection.tsx
"use client";

import type { JSX } from "react";
import { Button } from "@/components/ui/Button";
import { useApprovePartnerMutation, useRejectPartnerMutation } from "@/features/admin/mutations";
import { usePendingPartnersQuery } from "@/features/admin/queries";
import { formatKrw } from "@/features/partners/utils";

export function AdminDashboardPartnerSection(): JSX.Element {
	const { data: partners, isPending, isError } = usePendingPartnersQuery();
	const approveMutation = useApprovePartnerMutation();
	const rejectMutation = useRejectPartnerMutation();

	const isMutating = approveMutation.isPending || rejectMutation.isPending;

	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-[17px] font-semibold">파트너 승인 대기</h2>
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
						<article
							key={partner.profile_id}
							className="bg-surface-alt flex flex-col gap-2.5 rounded-2xl p-4">
							<div className="flex items-center justify-between">
								<span className="text-base font-semibold">
									{partner.nickname}
									<span className="text-sub text-sm font-normal"> · 실명 {partner.realName}</span>
								</span>
								<span className="text-[15px] font-bold tabular-nums">
									{formatKrw(partner.hourly_rate_krw)}
									<span className="text-sub text-xs font-normal"> /시간</span>
								</span>
							</div>
							<p className="text-sub text-sm leading-relaxed">{partner.bio}</p>
							{partner.interests.length > 0 && (
								<p className="text-sub text-xs">{partner.interests.join(" · ")}</p>
							)}
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									fullWidth
									disabled={isMutating}
									onClick={function () {
										rejectMutation.mutate(partner.profile_id);
									}}>
									거절
								</Button>
								<Button
									variant="secondary"
									size="sm"
									fullWidth
									disabled={isMutating}
									onClick={function () {
										approveMutation.mutate(partner.profile_id);
									}}>
									승인
								</Button>
							</div>
						</article>
					);
				})}
		</section>
	);
}
