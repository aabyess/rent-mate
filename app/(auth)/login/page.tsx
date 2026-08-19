// app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type JSX } from "react";
import { useSignInMutation } from "@/features/auth/mutations";

export default function LoginPage(): JSX.Element {
	const router = useRouter();
	const signInMutation = useSignInMutation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		signInMutation.mutate(
			{ email, password },
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
			<h1 className="text-2xl font-bold">로그인</h1>
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
					placeholder="비밀번호"
					required
					className="rounded-lg border border-gray-300 px-3 py-2"
				/>
				{signInMutation.isError && (
					<p className="text-sm text-red-500">이메일 또는 비밀번호를 확인해주세요.</p>
				)}
				<button
					type="submit"
					disabled={signInMutation.isPending}
					className="rounded-lg bg-black px-3 py-2 font-medium text-white disabled:opacity-50">
					{signInMutation.isPending ? "로그인 중..." : "로그인"}
				</button>
			</form>
			<p className="text-sm text-gray-500">
				계정이 없나요?{" "}
				<Link href="/signup" className="font-medium text-black underline">
					회원가입
				</Link>
			</p>
		</div>
	);
}
