// app/onboarding/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCreateProfileMutation } from "@/features/auth/mutations";
import { isAdultByYouthProtectionAct } from "@/features/auth/utils";

export default function OnboardingPage(): JSX.Element {
	const router = useRouter();
	const createProfileMutation = useCreateProfileMutation();
	const [name, setName] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [isUnderage, setIsUnderage] = useState(false);

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();

		// 성인인증 게이트: 청소년보호법 기준 만 19세(연 나이) 미만은 이용 불가
		if (!isAdultByYouthProtectionAct(birthDate)) {
			setIsUnderage(true);
			return;
		}
		setIsUnderage(false);

		createProfileMutation.mutate(
			{ name },
			{
				onSuccess: function (): void {
					router.replace("/");
					router.refresh();
				},
			},
		);
	}

	return (
		<main className="flex min-h-screen items-center justify-center px-4">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<div className="flex flex-col gap-1">
					<span className="text-brand text-[22px] font-bold tracking-tight">RentMate</span>
					<h1 className="text-2xl font-bold">프로필 만들기</h1>
				</div>
				<p className="bg-brand-subtle text-sub rounded-xl px-4 py-3 text-sm">
					RentMate는 만 19세 이상만 이용할 수 있습니다. 생년월일은 성인 여부 확인에만 사용됩니다.
				</p>
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<Input
						type="text"
						value={name}
						onChange={function (event) {
							setName(event.target.value);
						}}
						placeholder="이름"
						required
						maxLength={20}
					/>
					<Input
						type="date"
						value={birthDate}
						onChange={function (event) {
							setBirthDate(event.target.value);
						}}
						required
					/>
					{isUnderage && (
						<p className="text-error-500 text-sm">
							만 19세 미만은 RentMate를 이용할 수 없습니다. (청소년보호법)
						</p>
					)}
					{createProfileMutation.isError && (
						<p className="text-error-500 text-sm">{createProfileMutation.error.message}</p>
					)}
					<Button type="submit" fullWidth disabled={createProfileMutation.isPending}>
						{createProfileMutation.isPending ? "저장 중..." : "시작하기"}
					</Button>
				</form>
			</div>
		</main>
	);
}
