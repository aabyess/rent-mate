// features/sportsMate/components/SportsMatePostList/index.tsx
"use client";

import { useState, type JSX } from "react";
import { SportsMatePostListCard } from "@/features/sportsMate/components/SportsMatePostList/SportsMatePostListCard";
import { useMySportsMatePostsQuery, useSportsMatePostsQuery } from "@/features/sportsMate/queries";
import { cn } from "@/utils/cn";

type ListTab = "all" | "mine";

export function SportsMatePostList(): JSX.Element {
	const [tab, setTab] = useState<ListTab>("all");
	const { data: allPosts, isPending: isAllPending } = useSportsMatePostsQuery();
	const { data: myPosts, isPending: isMyPending } = useMySportsMatePostsQuery();

	const isPending = tab === "all" ? isAllPending : isMyPending;
	const posts = tab === "all" ? (allPosts ?? []) : (myPosts ?? []);

	return (
		<div className="flex flex-col gap-3.5">
			<div className="bg-surface-alt flex rounded-xl p-1">
				<button
					type="button"
					onClick={function () {
						setTab("all");
					}}
					className={cn(
						"h-9 flex-1 rounded-lg text-sm transition-colors",
						tab === "all" && "bg-surface text-body font-semibold shadow-sm",
						tab !== "all" && "text-sub",
					)}>
					전체 보기
				</button>
				<button
					type="button"
					onClick={function () {
						setTab("mine");
					}}
					className={cn(
						"h-9 flex-1 rounded-lg text-sm transition-colors",
						tab === "mine" && "bg-surface text-body font-semibold shadow-sm",
						tab !== "mine" && "text-sub",
					)}>
					내 모집글
				</button>
			</div>

			{isPending ? (
				<div className="flex flex-col gap-3">
					<div className="bg-surface-alt h-32 animate-pulse rounded-2xl" />
					<div className="bg-surface-alt h-32 animate-pulse rounded-2xl" />
				</div>
			) : posts.length === 0 ? (
				<p className="text-sub py-16 text-center text-sm">
					{tab === "all" ? "아직 모집 중인 글이 없어요." : "작성한 모집글이 없어요."}
				</p>
			) : (
				<div className="flex flex-col gap-3">
					{posts.map(function (post) {
						return (
							<SportsMatePostListCard key={post.id} post={post} showOwnerActions={tab === "mine"} />
						);
					})}
				</div>
			)}
		</div>
	);
}
