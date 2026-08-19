// app/(auth)/signup/page.tsx
"use client";

import Link from "next/link";
import { useState, type FormEvent, type JSX } from "react";
import { useSignUpMutation } from "@/features/auth/mutations";

export default function SignupPage(): JSX.Element {
	const signUpMutation = useSignUpMutation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		signUpMutation.mutate({ email, password });
	}

	if (signUpMutation.isSuccess) {
		return (
			<div className="flex flex-col gap-4">
				<h1 className="text-2xl font-bold">이메일을 확인해주세요</h1>
				<p className="text-gray-600">
					{email} 주소로 인증 메일을 보냈습니다. 메일의 링크를 눌러 가입을 완료한 뒤 로그인해주세요.
				</p>
				<Link href="/login" className="font-medium text-black underline">
					로그인으로 이동
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl font-bold">회원가입</h1>
			<p className="text-sm text-gray-500">
				RentMate는 만 19세 이상만 이용할 수 있는 서비스입니다. 가입 후 성인인증이 진행됩니다.
			</p>
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				<input
					type="email"
					value={email}
					onChange={function (event) {
						setEmail(event.target.value);
					}}
					placeholder="이메일"
					required
					className="rounded-lg border border-gray-300 px-3 py-2"
				/>
				<input
					type="password"
					value={password}
					onChange={function (event) {
						setPassword(event.target.value);
					}}
					placeholder="비밀번호 (6자 이상)"
					required
					minLength={6}
					className="rounded-lg border border-gray-300 px-3 py-2"
				/>
				{signUpMutation.isError && (
					<p className="text-sm text-red-500">{signUpMutation.error.message}</p>
				)}
				<button
					type="submit"
					disabled={signUpMutation.isPending}
					className="rounded-lg bg-black px-3 py-2 font-medium text-white disabled:opacity-50">
					{signUpMutation.isPending ? "가입 중..." : "회원가입"}
				</button>
			</form>
			<p className="text-sm text-gray-500">
				이미 계정이 있나요?{" "}
				<Link href="/login" className="font-medium text-black underline">
					로그인
				</Link>
			</p>
		</div>
	);
}
