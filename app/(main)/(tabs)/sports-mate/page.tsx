// app/(main)/(tabs)/sports-mate/page.tsx
import Link from "next/link";
import type { JSX } from "react";
import { SportsMatePostList } from "@/features/sportsMate/components/SportsMatePostList";

export default function SportsMatePage(): JSX.Element {
	return (
		<main className="flex flex-col gap-5 px-5 py-4 pb-16">
			<div className="flex items-center gap-3">
				<Link href="/me" aria-label="마이페이지로 돌아가기">
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
				<h1 className="text-lg font-bold">운동 메이트</h1>
				<Link
					href="/sports-mate/new"
					className="bg-brand ml-auto flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold text-white">
					글쓰기
				</Link>
			</div>
			<SportsMatePostList />
		</main>
	);
}
