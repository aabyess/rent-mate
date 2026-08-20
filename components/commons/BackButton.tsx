// components/commons/BackButton.tsx
"use client";

import { useRouter } from "next/navigation";
import type { JSX } from "react";

type BackButtonProps = {
	ariaLabel?: string;
};

// 고정 href 대신 실제 이전 화면으로 돌아가는 뒤로가기 — 진입 경로가 여러 곳인 페이지용
export function BackButton({ ariaLabel = "뒤로 가기" }: BackButtonProps): JSX.Element {
	const router = useRouter();

	function handleClick(): void {
		router.back();
	}

	return (
		<button type="button" onClick={handleClick} aria-label={ariaLabel}>
			<svg
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round">
				<path d="M15 5l-7 7 7 7" />
			</svg>
		</button>
	);
}
