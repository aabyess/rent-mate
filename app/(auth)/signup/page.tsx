// app/(auth)/signup/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSignUpMutation } from "@/features/auth/mutations";
import { isValidUsername } from "@/features/auth/utils";

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
					router.replace("/");
					router.refresh();
				},
			},
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<span className="text-brand text-[22px] font-bold tracking-tight">RentMate</span>
				<h1 className="text-2xl font-bold">회원가입</h1>
			</div>
			<p className="bg-warning-100 text-warning-700 rounded-xl px-4 py-3 text-sm">
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
					<p className="text-error-500 text-sm">
						가입에 실패했어요. 이미 사용 중인 아이디일 수 있어요.
					</p>
				)}
				<Button type="submit" fullWidth disabled={signUpMutation.isPending}>
					{signUpMutation.isPending ? "가입 중..." : "회원가입"}
				</Button>
			</form>
			<p className="text-sub text-sm">
				이미 계정이 있나요?{" "}
				<Link href="/login" className="text-brand font-medium underline">
					로그인
				</Link>
			</p>
		</div>
	);
}
