// features/partners/components/PartnerList/index.tsx
"use client";

import Link from "next/link";
import type { JSX } from "react";
import { PartnerListCard } from "@/features/partners/components/PartnerList/PartnerListCard";
import { usePartnerListQuery } from "@/features/partners/queries";

export function PartnerList(): JSX.Element {
	const { data: partners, isPending, isError } = usePartnerListQuery();

	if (isPending) {
		return (
			<div className="grid grid-cols-2 gap-3.5">
				{Array.from({ length: 4 }, function (_, index) {
					return (
						<div key={index} className="flex flex-col gap-2">
							<div className="bg-surface-alt h-56 animate-pulse rounded-2xl" />
							<div className="bg-surface-alt h-4 w-2/3 animate-pulse rounded" />
							<div className="bg-surface-alt h-3 w-1/2 animate-pulse rounded" />
						</div>
					);
				})}
			</div>
		);
	}

	if (isError) {
		return <p className="text-sub py-16 text-center text-sm">파트너 목록을 불러오지 못했어요.</p>;
	}

	if (partners.length === 0) {
		return <p className="text-sub py-16 text-center text-sm">아직 등록된 파트너가 없어요.</p>;
	}

	return (
		<div className="grid grid-cols-2 gap-3.5">
			{partners.map(function (partner, index) {
				return (
					<Link key={partner.profile_id} href={`/partners/${partner.profile_id}`}>
						<PartnerListCard partner={partner} index={index} />
					</Link>
				);
			})}
		</div>
	);
}
