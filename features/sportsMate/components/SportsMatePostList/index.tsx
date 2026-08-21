// features/sportsMate/components/SportsMatePostList/index.tsx
"use client";

import { useState, type JSX } from "react";
import { SportsMatePostListCard } from "@/features/sportsMate/components/SportsMatePostList/SportsMatePostListCard";
import { SportsMateRequestListCard } from "@/features/sportsMate/components/SportsMatePostList/SportsMateRequestListCard";
import {
	useMySportsMatePostsQuery,
	useMySportsMateRequestsQuery,
	useSportsMatePostsQuery,
} from "@/features/sportsMate/queries";
import type { SportsMateRequestStatus } from "@/features/sportsMate/types";
import { cn } from "@/utils/cn";

type ListTab = "all" | "mine" | "myRequests";

const TABS: { key: ListTab; label: string }[] = [
	{ key: "all", label: "전체 보기" },
	{ key: "mine", label: "내 모집글" },
	{ key: "myRequests", label: "내 신청" },
];

export function SportsMatePostList(): JSX.Element {
	const [tab, setTab] = useState<ListTab>("all");
	const { data: allPosts, isPending: isAllPending } = useSportsMatePostsQuery();
	const { data: myPosts, isPending: isMyPending } = useMySportsMatePostsQuery();
	const { data: myRequests, isPending: isMyRequestsPending } = useMySportsMateRequestsQuery();

	// 최신 신청 하나만 상태로 보여준다(같은 글에 재신청은 취소/거절 후에나 가능해서 사실상 1건)
	const myRequestStatusByPostId = new Map<string, SportsMateRequestStatus>();
	(myRequests ?? []).forEach(function (request) {
		myRequestStatusByPostId.set(request.post_id, request.status);
	});

	const isPending =
		tab === "all" ? isAllPending : tab === "mine" ? isMyPending : isMyRequestsPending;

	return (
		<div className="flex flex-col gap-3.5">
			<div className="bg-surface-alt flex rounded-xl p-1">
				{TABS.map(function (item) {
					const isActive = tab === item.key;
					return (
						<button
							key={item.key}
							type="button"
							onClick={function () {
								setTab(item.key);
							}}
							className={cn(
								"h-9 flex-1 rounded-lg text-sm transition-colors",
								isActive && "bg-surface text-body font-semibold shadow-sm",
								!isActive && "text-sub",
							)}>
							{item.label}
						</button>
					);
				})}
			</div>

			{isPending ? (
				<div className="flex flex-col gap-3">
					<div className="bg-surface-alt h-32 animate-pulse rounded-2xl" />
					<div className="bg-surface-alt h-32 animate-pulse rounded-2xl" />
				</div>
			) : tab === "all" ? (
				(allPosts ?? []).length === 0 ? (
					<p className="text-sub py-16 text-center text-sm">아직 모집 중인 글이 없어요.</p>
				) : (
					<div className="flex flex-col gap-3">
						{(allPosts ?? []).map(function (post) {
							return (
								<SportsMatePostListCard
									key={post.id}
									post={post}
									mode="all"
									myRequestStatus={myRequestStatusByPostId.get(post.id)}
								/>
							);
						})}
					</div>
				)
			) : tab === "mine" ? (
				(myPosts ?? []).length === 0 ? (
					<p className="text-sub py-16 text-center text-sm">작성한 모집글이 없어요.</p>
				) : (
					<div className="flex flex-col gap-3">
						{(myPosts ?? []).map(function (post) {
							return <SportsMatePostListCard key={post.id} post={post} mode="mine" />;
						})}
					</div>
				)
			) : (myRequests ?? []).length === 0 ? (
				<p className="text-sub py-16 text-center text-sm">신청한 모집글이 없어요.</p>
			) : (
				<div className="flex flex-col gap-3">
					{(myRequests ?? []).map(function (request) {
						return <SportsMateRequestListCard key={request.id} request={request} />;
					})}
				</div>
			)}
		</div>
	);
}
