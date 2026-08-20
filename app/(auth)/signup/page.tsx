// app/(auth)/signup/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthHero } from "@/features/auth/components/AuthHero";
import { useSignUpMutation } from "@/features/auth/mutations";
import { getSignUpErrorMessage, isValidUsername } from "@/features/auth/utils";

export default function SignupPage(): JSX.Element {
	const router = useRouter();
	const signUpMutation = useSignUpMutation();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isUsernameInvalid, setIsUsernameInvalid] = useState(false);

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		if (!isValidUsername(username)) {
			setIsUsernameInvalid(true);
			return;
		}
		setIsUsernameInvalid(false);
		signUpMutation.mutate(
			{ username, password },
			{
				onSuccess: function (): void {
					// 가입 즉시 세션이 발급되므로(자동 로그인) 로그인 화면을 거치지 않고 온보딩 직행
					router.replace("/onboarding");
					router.refresh();
				},
			},
		);
	}

	return (
		<div className="flex flex-col gap-7">
			<AuthHero />
			<div className="bg-surface flex flex-col gap-4 rounded-3xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
				<h1 className="text-lg font-bold">회원가입</h1>
				<p className="bg-warning-500/15 text-warning-500 rounded-xl px-4 py-3 text-[13px] leading-relaxed">
					RentMate는 만 19세 이상만 이용할 수 있는 서비스입니다. 가입 후 성인인증이 진행됩니다.
				</p>
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<Input
						type="text"
						value={username}
						onChange={function (event) {
							setUsername(event.target.value.toLowerCase());
						}}
						placeholder="아이디 (영문 소문자·숫자 4~20자)"
						autoComplete="username"
						required
						minLength={4}
						maxLength={20}
					/>
					<Input
						type="password"
						value={password}
						onChange={function (event) {
							setPassword(event.target.value);
						}}
						placeholder="비밀번호 (6자 이상)"
						autoComplete="new-password"
						required
						minLength={6}
					/>
					{isUsernameInvalid && (
						<p className="text-error-500 text-sm">
							아이디는 영문 소문자·숫자 조합 4~20자로 입력해주세요.
						</p>
					)}
					{signUpMutation.isError && (
						<p className="text-error-500 text-sm">{getSignUpErrorMessage(signUpMutation.error)}</p>
					)}
					<Button
						type="submit"
						fullWidth
						isLoading={signUpMutation.isPending}
						disabled={signUpMutation.isSuccess}>
						{signUpMutation.isSuccess
							? "가입 완료! 프로필을 만들러 가요 🎉"
							: signUpMutation.isPending
								? "가입 중..."
								: "회원가입"}
					</Button>
				</form>
				<p className="text-sub text-center text-sm">
					이미 계정이 있나요?{" "}
					<Link href="/login" className="text-brand font-medium underline">
						로그인
					</Link>
				</p>
			</div>
		</div>
	);
}
