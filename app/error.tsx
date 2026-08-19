// app/error.tsx
"use client";

import Link from "next/link";
import { useEffect, type JSX } from "react";
import { Button } from "@/components/ui/Button";

type ErrorPageProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps): JSX.Element {
	useEffect(
		function () {
			console.error("[app] unhandled error", error);
		},
		[error],
	);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
			<svg
				width="44"
				height="44"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="text-brand">
				<circle cx="12" cy="12" r="9" />
				<path d="M12 7.5v5M12 15.8v.2" />
			</svg>
			<div className="flex flex-col gap-1.5">
				<h1 className="text-xl font-bold">잠시 문제가 생겼어요</h1>
				<p className="text-sub text-sm leading-relaxed">
					일시적인 오류일 수 있어요. 다시 시도해도 반복되면
					<br />
					고객센터로 알려주세요.
				</p>
			</div>
			<div className="flex gap-2.5">
				<Button onClick={reset}>다시 시도</Button>
				<Link
					href="/"
					className="border-line bg-surface text-body hover:bg-surface-alt flex h-12 items-center justify-center rounded-xl border px-5 font-medium transition-colors">
					홈으로
				</Link>
			</div>
		</main>
	);
}
