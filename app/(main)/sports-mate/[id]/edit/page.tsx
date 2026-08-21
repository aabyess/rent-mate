// app/(main)/sports-mate/[id]/edit/page.tsx
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { JSX } from "react";
import { useMyProfileQuery } from "@/features/auth/queries";
import { SportsMatePostForm } from "@/features/sportsMate/components/SportsMatePostForm";
import { usePatchSportsMatePostMutation } from "@/features/sportsMate/mutations";
import { useSportsMatePostQuery } from "@/features/sportsMate/queries";
import type { SportsMatePostInput } from "@/features/sportsMate/types";

function BackHeader(): JSX.Element {
	return (
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
			<h1 className="text-lg font-bold">모집글 수정</h1>
		</div>
	);
}

export default function SportsMateEditPage(): JSX.Element {
	const router = useRouter();
	const params = useParams<{ id: string }>();
	const postId = params.id;
	const { data: post, isPending: isPostPending } = useSportsMatePostQuery(postId);
	const { data: myProfile, isPending: isProfilePending } = useMyProfileQuery();
	const patchMutation = usePatchSportsMatePostMutation(postId);

	function handleSubmit(input: SportsMatePostInput): void {
		patchMutation.mutate(input, {
			onSuccess: function (): void {
				router.replace("/sports-mate");
			},
		});
	}

	if (isPostPending || isProfilePending) {
		return (
			<main className="flex flex-col gap-5 px-5 py-4 pb-16">
				<BackHeader />
				<div className="bg-surface-alt h-64 animate-pulse rounded-2xl" />
			</main>
		);
	}

	if (!post || !myProfile || post.author_id !== myProfile.id) {
		return (
			<main className="flex flex-col gap-5 px-5 py-4 pb-16">
				<BackHeader />
				<p className="text-sub py-16 text-center text-sm">수정할 수 있는 모집글이 아니에요.</p>
			</main>
		);
	}

	if (post.status !== "open") {
		return (
			<main className="flex flex-col gap-5 px-5 py-4 pb-16">
				<BackHeader />
				<p className="text-sub py-16 text-center text-sm">
					모집 중인 글만 수정할 수 있어요. (현재 상태:{" "}
					{post.status === "matched" ? "매칭 완료" : "마감"})
				</p>
			</main>
		);
	}

	return (
		<main className="flex flex-col gap-5 px-5 py-4 pb-16">
			<BackHeader />
			<SportsMatePostForm
				initialValues={{
					sport: post.sport,
					region: post.region,
					preferredDate: post.preferred_date,
					timeSlot: post.time_slot,
					genderMode: post.gender_mode,
					comment: post.comment,
				}}
				isSubmitting={patchMutation.isPending}
				submitLabel="수정 완료"
				errorMessage={patchMutation.error?.message ?? null}
				onSubmit={handleSubmit}
			/>
		</main>
	);
}
