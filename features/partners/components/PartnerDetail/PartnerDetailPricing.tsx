// features/partners/components/PartnerDetail/PartnerDetailPricing.tsx
import type { JSX } from "react";
import {
	calculateBaseTwoHourPrice,
	calculateHalfHourExtensionPrice,
	formatKrw,
} from "@/features/partners/utils";

type PartnerDetailPricingProps = {
	hourlyRateKrw: number;
};

export function PartnerDetailPricing({ hourlyRateKrw }: PartnerDetailPricingProps): JSX.Element {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-[17px] font-semibold">요금</h2>
			<div className="bg-surface-alt flex flex-col overflow-hidden rounded-2xl">
				<div className="bg-brand-subtle flex items-center justify-between px-4 py-3.5">
					<span className="text-primary-700 text-sm font-medium">기본 2시간</span>
					<span className="text-primary-700 text-base font-bold tabular-nums">
						{formatKrw(calculateBaseTwoHourPrice(hourlyRateKrw))}
					</span>
				</div>
				<div className="flex items-center justify-between px-4 py-3.5">
					<span className="text-sub text-sm">시간당 요금</span>
					<span className="text-[15px] font-semibold tabular-nums">{formatKrw(hourlyRateKrw)}</span>
				</div>
				<div className="flex items-center justify-between px-4 py-3.5">
					<span className="text-sub text-sm">30분 연장</span>
					<span className="text-[15px] font-semibold tabular-nums">
						{formatKrw(calculateHalfHourExtensionPrice(hourlyRateKrw))}
					</span>
				</div>
			</div>
			<p className="text-sub text-xs">
				결제 금액은 에스크로로 보호되며, 데이트 완료 후 파트너에게 정산됩니다.
			</p>
		</section>
	);
}
