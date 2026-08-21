// app/(main)/sports-mate/new/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { SportsMatePostForm } from "@/features/sportsMate/components/SportsMatePostForm";
import { useCreateSportsMatePostMutation } from "@/features/sportsMate/mutations";
import type { SportsMatePostInput } from "@/features/sportsMate/types";

export default function SportsMateNewPage(): JSX.Element {
	const router = useRouter();
	const createMutation = useCreateSportsMatePostMutation();

	function handleSubmit(input: SportsMatePostInput): void {
		createMutation.mutate(input, {
			onSuccess: function (): void {
				router.replace("/sports-mate");
			},
		});
	}

	return (
		<main className="flex flex-col gap-5 px-5 py-4 pb-16">
			<div className="flex items-center gap-3">
				<Link href="/sports-mate" aria-label="운동 메이트로 돌아가기">
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
				<h1 className="text-lg font-bold">모집글 작성</h1>
			</div>
			<SportsMatePostForm
				isSubmitting={createMutation.isPending}
				submitLabel="모집글 등록"
				errorMessage={createMutation.error?.message ?? null}
				onSubmit={handleSubmit}
			/>
		</main>
	);
}
