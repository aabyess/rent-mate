// app/(main)/partner/earnings/page.tsx
import Link from "next/link";
import type { JSX } from "react";
import { PartnerEarnings } from "@/features/bookings/components/PartnerEarnings";

export default function PartnerEarningsPage(): JSX.Element {
	return (
		<main className="flex flex-col gap-5 px-5 py-4 pb-16">
			<div className="flex items-center gap-3">
				<Link href="/bookings" aria-label="예약으로 돌아가기">
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M15 5l-7 7 7 7" />
					</svg>
				</Link>
				<h1 className="text-lg font-bold">정산 내역</h1>
			</div>
			<PartnerEarnings />
		</main>
	);
}
