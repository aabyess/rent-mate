// features/partnerPosts/components/PartnerPostList.tsx
"use client";

import Image from "next/image";
import { useState, type JSX } from "react";
import { useMyProfileQuery } from "@/features/auth/queries";
import { useDeletePartnerPostMutation } from "@/features/partnerPosts/mutations";
import { usePartnerPostsQuery } from "@/features/partnerPosts/queries";
import { formatPostTime } from "@/features/partnerPosts/utils";
import { ReportDialog } from "@/features/safety/components/ReportDialog";

type PartnerPostListProps = {
	partnerId: string;
	partnerNickname: string;
};

// 파트너 상세의 "소식" 피드 — 본인 글에는 삭제, 남의 글에는 신고가 붙는다
export function PartnerPostList({ partnerId, partnerNickname }: PartnerPostListProps): JSX.Element {
	const { data: posts, isPending } = usePartnerPostsQuery(partnerId);
	const { data: myProfile } = useMyProfileQuery();
	const deletePostMutation = useDeletePartnerPostMutation(partnerId);
	const [reportPostId, setReportPostId] = useState<string | null>(null);

	if (isPending) {
		return <div className="bg-surface-alt h-24 animate-pulse rounded-2xl" />;
	}

	if (!posts || posts.length === 0) {
		return <p className="text-sub py-6 text-center text-sm">아직 올라온 소식이 없어요.</p>;
	}

	return (
		<div className="flex flex-col gap-3">
			{posts.map(function (post) {
				const isMine = myProfile?.id === post.partner_id;
				return (
					<article key={post.id} className="bg-surface-alt flex flex-col gap-2.5 rounded-2xl p-4">
						{post.photo_url && (
							<div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
								<Image
									src={post.photo_url}
									alt="파트너가 올린 사진"
									fill
									sizes="(max-width: 448px) 100vw, 408px"
									className="object-cover"
								/>
							</div>
						)}
						<p className="text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>
						<div className="flex items-center justify-between">
							<span className="text-sub text-xs tabular-nums">
								{formatPostTime(post.created_at)}
							</span>
							{isMine ? (
								<button
									type="button"
									disabled={deletePostMutation.isPending}
									onClick={function () {
										deletePostMutation.mutate(post.id);
									}}
									className="text-sub text-xs underline underline-offset-2">
									삭제
								</button>
							) : (
								<button
									type="button"
									onClick={function () {
										setReportPostId(post.id);
									}}
									className="text-sub text-xs underline underline-offset-2">
									신고
								</button>
							)}
						</div>
					</article>
				);
			})}

			{reportPostId !== null && (
				<ReportDialog
					onClose={function () {
						setReportPostId(null);
					}}
					targetId={partnerId}
					targetNickname={partnerNickname}
					reasonContext={`일기 ${reportPostId}`}
				/>
			)}
		</div>
	);
}
