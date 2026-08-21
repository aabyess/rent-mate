// features/tokens/components/TokenWallet.tsx
"use client";

import type { JSX } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { getTossClientKey } from "@/features/payments/apis";
import { TokenWalletChargeDialog } from "@/features/tokens/components/TokenWalletChargeDialog";
import { useMyTokenBalanceQuery, useMyTokenLedgerQuery } from "@/features/tokens/queries";
import { cn } from "@/utils/cn";

const IS_TOSS_ENABLED = getTossClientKey() !== null;

// 원장 reason → 사용자 표시 라벨. 새 reason이 생기면 여기에 추가한다.
const REASON_LABELS: Record<string, string> = {
	welcome: "가입 축하 지급",
	welcome_upgrade: "지급 상향",
	rewind: "덱 되감기",
	booking_request: "예약 신청",
	date_completed: "데이트 완료",
	purchase: "토큰 충전",
};

function formatLedgerDate(createdAt: string): string {
	const date = new Date(createdAt);
	return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function TokenWallet(): JSX.Element {
	const { data: balance, isPending: isBalancePending } = useMyTokenBalanceQuery();
	const { data: ledger, isPending: isLedgerPending, isError } = useMyTokenLedgerQuery();
	const [isChargeDialogOpen, setIsChargeDialogOpen] = useState(false);

	return (
		<div className="flex flex-col gap-5">
			<div className="bg-brand-subtle flex flex-col items-center gap-1.5 rounded-2xl px-5 py-7">
				<span className="text-sub text-sm font-medium">보유 토큰</span>
				{isBalancePending ? (
					<div className="bg-surface h-9 w-24 animate-pulse rounded-lg" />
				) : (
					<span className="text-3xl font-bold tabular-nums">🪙 {balance ?? 0}</span>
				)}
				{IS_TOSS_ENABLED ? (
					<Button
						size="sm"
						className="mt-1.5"
						onClick={function () {
							setIsChargeDialogOpen(true);
						}}>
						충전하기
					</Button>
				) : (
					<span className="text-sub text-xs">충전 기능은 준비 중이에요</span>
				)}
			</div>

			{isChargeDialogOpen && (
				<TokenWalletChargeDialog
					onClose={function () {
						setIsChargeDialogOpen(false);
					}}
				/>
			)}

			<section className="flex flex-col gap-2.5">
				<h2 className="text-[15px] font-semibold">사용 내역</h2>
				{isLedgerPending && (
					<div className="flex flex-col gap-2">
						<div className="bg-surface-alt h-13 animate-pulse rounded-xl" />
						<div className="bg-surface-alt h-13 animate-pulse rounded-xl" />
					</div>
				)}
				{isError && <p className="text-sub py-6 text-center text-sm">내역을 불러오지 못했어요.</p>}
				{ledger && ledger.length === 0 && (
					<p className="text-sub py-6 text-center text-sm">아직 내역이 없어요.</p>
				)}
				{ledger && ledger.length > 0 && (
					<div className="bg-surface divide-line flex flex-col divide-y rounded-2xl">
						{ledger.map(function (entry) {
							const isCredit = entry.amount > 0;
							return (
								<div key={entry.id} className="flex items-center justify-between px-4 py-3.5">
									<div className="flex flex-col gap-0.5">
										<span className="text-sm font-medium">
											{REASON_LABELS[entry.reason] ?? entry.reason}
										</span>
										<span className="text-sub text-xs tabular-nums">
											{formatLedgerDate(entry.created_at)}
										</span>
									</div>
									<span
										className={cn(
											"text-[15px] font-bold tabular-nums",
											isCredit ? "text-trust" : "text-body",
										)}>
										{isCredit ? "+" : ""}
										{entry.amount}
									</span>
								</div>
							);
						})}
					</div>
				)}
			</section>
		</div>
	);
}
