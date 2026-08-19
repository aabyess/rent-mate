// app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSignInMutation } from "@/features/auth/mutations";

export default function LoginPage(): JSX.Element {
	const router = useRouter();
	const signInMutation = useSignInMutation();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		signInMutation.mutate(
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
				<h1 className="text-2xl font-bold">로그인</h1>
			</div>
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				<Input
					type="text"
					value={username}
					onChange={function (event) {
						setUsername(event.target.value);
					}}
					placeholder="아이디"
					autoComplete="username"
					required
				/>
				<Input
					type="password"
					value={password}
					onChange={function (event) {
						setPassword(event.target.value);
					}}
					placeholder="비밀번호"
					autoComplete="current-password"
					required
				/>
				{signInMutation.isError && (
					<p className="text-error-500 text-sm">아이디 또는 비밀번호를 확인해주세요.</p>
				)}
				<Button type="submit" fullWidth disabled={signInMutation.isPending}>
					{signInMutation.isPending ? "로그인 중..." : "로그인"}
				</Button>
			</form>
			<p className="text-sub text-sm">
				계정이 없나요?{" "}
				<Link href="/signup" className="text-brand font-medium underline">
					회원가입
				</Link>
			</p>
		</div>
	);
}
