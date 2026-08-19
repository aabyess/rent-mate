// features/partners/components/PartnerDetail/PartnerDetailActionBar.tsx
import type { JSX } from "react";
import { Button } from "@/components/ui/Button";
import { formatKrw } from "@/features/partners/utils";

type PartnerDetailActionBarProps = {
	hourlyRateKrw: number;
};

export function PartnerDetailActionBar({
	hourlyRateKrw,
}: PartnerDetailActionBarProps): JSX.Element {
	return (
		<div className="border-line bg-surface/80 fixed bottom-0 left-1/2 z-10 flex w-full max-w-md -translate-x-1/2 items-center gap-2.5 border-t px-5 pt-3 pb-6 backdrop-blur-xl">
			<div className="flex flex-col">
				<span className="text-sub text-xs">시간당</span>
				<span className="text-lg font-bold tabular-nums">{formatKrw(hourlyRateKrw)}</span>
			</div>
			<div className="flex grow justify-end gap-2">
				<Button variant="outline" size="lg" disabled className="text-trust">
					채팅 문의
				</Button>
				<Button size="lg" disabled className="px-8">
					예약하기
				</Button>
			</div>
		</div>
	);
}
