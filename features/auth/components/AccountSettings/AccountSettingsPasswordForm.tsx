// features/auth/components/AccountSettings/AccountSettingsPasswordForm.tsx
"use client";

import { useState, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useChangePasswordMutation } from "@/features/auth/mutations";
import { useToastStore } from "@/store/useToastStore";

const MIN_PASSWORD_LENGTH = 6;

export function AccountSettingsPasswordForm(): JSX.Element {
	const changePasswordMutation = useChangePasswordMutation();
	const showToast = useToastStore(function (state) {
		return state.showToast;
	});

	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isMismatch, setIsMismatch] = useState(false);

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		if (newPassword !== confirmPassword) {
			setIsMismatch(true);
			return;
		}
		setIsMismatch(false);
		changePasswordMutation.mutate(
			{ password: newPassword },
			{
				onSuccess: function (): void {
					setNewPassword("");
					setConfirmPassword("");
					showToast("비밀번호가 변경됐어요");
				},
			},
		);
	}

	const isValid =
		newPassword.length >= MIN_PASSWORD_LENGTH && confirmPassword.length >= MIN_PASSWORD_LENGTH;

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			<h2 className="text-[17px] font-semibold">비밀번호 변경</h2>
			<Input
				type="password"
				value={newPassword}
				onChange={function (event) {
					setNewPassword(event.target.value);
				}}
				placeholder="새 비밀번호 (6자 이상)"
				autoComplete="new-password"
				minLength={MIN_PASSWORD_LENGTH}
			/>
			<Input
				type="password"
				value={confirmPassword}
				onChange={function (event) {
					setConfirmPassword(event.target.value);
				}}
				placeholder="새 비밀번호 확인"
				autoComplete="new-password"
				minLength={MIN_PASSWORD_LENGTH}
			/>
			{isMismatch && <p className="text-error-500 text-sm">비밀번호가 서로 달라요.</p>}
			{changePasswordMutation.isError && (
				<p className="text-error-500 text-sm">{changePasswordMutation.error.message}</p>
			)}
			<Button
				type="submit"
				variant="outline"
				fullWidth
				disabled={!isValid || changePasswordMutation.isPending}>
				{changePasswordMutation.isPending ? "변경 중..." : "비밀번호 변경"}
			</Button>
		</form>
	);
}
