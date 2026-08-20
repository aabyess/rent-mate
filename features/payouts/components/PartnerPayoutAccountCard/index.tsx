// features/payouts/components/PartnerPayoutAccountCard/index.tsx
"use client";

import { useState, type ChangeEvent, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUpsertPayoutAccountMutation } from "@/features/payouts/mutations";
import { useMyPayoutAccountQuery } from "@/features/payouts/queries";
import { maskAccountNumber } from "@/features/payouts/utils";

export function PartnerPayoutAccountCard(): JSX.Element {
	const { data: account, isPending } = useMyPayoutAccountQuery();
	const upsertMutation = useUpsertPayoutAccountMutation();
	const [isEditing, setIsEditing] = useState(false);
	const [bankName, setBankName] = useState("");
	const [accountHolder, setAccountHolder] = useState("");
	const [accountNumber, setAccountNumber] = useState("");

	function startEditing(): void {
		setBankName(account?.bank_name ?? "");
		setAccountHolder(account?.account_holder ?? "");
		setAccountNumber("");
		setIsEditing(true);
	}

	function cancelEditing(): void {
		setIsEditing(false);
	}

	function handleBankNameChange(event: ChangeEvent<HTMLInputElement>): void {
		setBankName(event.target.value);
	}

	function handleAccountHolderChange(event: ChangeEvent<HTMLInputElement>): void {
		setAccountHolder(event.target.value);
	}

	function handleAccountNumberChange(event: ChangeEvent<HTMLInputElement>): void {
		setAccountNumber(event.target.value);
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		upsertMutation.mutate(
			{ bankName, accountHolder, accountNumber },
			{
				onSuccess: function (): void {
					setIsEditing(false);
				},
			},
		);
	}

	if (isPending) {
		return <div className="bg-surface-alt h-20 animate-pulse rounded-2xl" />;
	}

	if (isEditing) {
		return (
			<form
				onSubmit={handleSubmit}
				className="bg-surface-alt flex flex-col gap-2.5 rounded-2xl p-4">
				<h2 className="text-[15px] font-semibold">정산 계좌 등록</h2>
				<Input placeholder="은행명" value={bankName} onChange={handleBankNameChange} required />
				<Input
					placeholder="예금주"
					value={accountHolder}
					onChange={handleAccountHolderChange}
					required
				/>
				<Input
					placeholder={
						account
							? `계좌번호 재입력 (기존 ${maskAccountNumber(account.account_number)})`
							: "계좌번호"
					}
					value={accountNumber}
					onChange={handleAccountNumberChange}
					inputMode="numeric"
					required
				/>
				{upsertMutation.isError && (
					<p className="text-error-500 text-sm">{upsertMutation.error.message}</p>
				)}
				<div className="flex gap-2">
					<Button type="button" variant="outline" size="sm" fullWidth onClick={cancelEditing}>
						취소
					</Button>
					<Button type="submit" size="sm" fullWidth isLoading={upsertMutation.isPending}>
						저장
					</Button>
				</div>
			</form>
		);
	}

	if (!account) {
		return (
			<div className="bg-warning-500/15 flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5">
				<p className="text-warning-500 text-sm font-medium">정산 계좌를 등록해주세요.</p>
				<Button size="sm" onClick={startEditing}>
					등록하기
				</Button>
			</div>
		);
	}

	return (
		<div className="bg-surface-alt flex items-center justify-between gap-3 rounded-2xl p-4">
			<div className="flex flex-col gap-0.5">
				<span className="text-sm font-semibold">정산 계좌</span>
				<span className="text-sub text-sm tabular-nums">
					{account.bank_name} {maskAccountNumber(account.account_number)} · {account.account_holder}
				</span>
			</div>
			<Button variant="outline" size="sm" onClick={startEditing}>
				수정
			</Button>
		</div>
	);
}
