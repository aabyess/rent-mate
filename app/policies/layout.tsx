// app/policies/layout.tsx
import Link from "next/link";
import type { JSX, ReactNode } from "react";

// 약관·정책은 성인인증 게이트 통과 전(가입 단계)에도 열람 가능해야 하므로 (main) 그룹 밖 공개 라우트다
type PoliciesLayoutProps = {
	children: ReactNode;
};

export default function PoliciesLayout({ children }: PoliciesLayoutProps): JSX.Element {
	return (
		<div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
			<header className="border-line bg-surface/80 sticky top-0 z-10 flex items-center gap-3 border-b px-5 py-3 backdrop-blur-xl">
				<Link href="/" aria-label="홈으로" className="text-body">
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
				</Link>
				<span className="text-lg font-bold">약관 및 정책</span>
			</header>
			<main className="flex flex-col gap-6 px-5 py-6 pb-16">{children}</main>
		</div>
	);
}
