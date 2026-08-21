// features/sportsMate/components/SportsMatePostList/SportsMatePostListCard.tsx
import Link from "next/link";
import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { usePatchSportsMatePostStatusMutation } from "@/features/sportsMate/mutations";
import type { SportsMatePost } from "@/features/sportsMate/types";
import {
	formatPreferredDate,
	getGenderModeLabel,
	getSportEmoji,
	getTimeSlotLabel,
} from "@/features/sportsMate/utils";
import { useToastStore } from "@/store/useToastStore";

type SportsMatePostListCardProps = {
	post: SportsMatePost;
	showOwnerActions: boolean;
};

const STATUS_LABELS: Record<SportsMatePost["status"], string> = {
	open: "모집 중",
	matched: "매칭 완료",
	closed: "마감",
};

export function SportsMatePostListCard({
	post,
	showOwnerActions,
}: SportsMatePostListCardProps): JSX.Element {
	const patchStatusMutation = usePatchSportsMatePostStatusMutation();
	const showToast = useToastStore(function (state) {
		return state.showToast;
	});

	function handleClose(): void {
		patchStatusMutation.mutate(
			{ postId: post.id, status: "closed" },
			{
				onSuccess: function (): void {
					showToast("모집을 마감했어요");
				},
			},
		);
	}

	return (
		<div className="bg-surface flex flex-col gap-3 rounded-2xl p-4.5">
			<div className="flex items-start justify-between gap-2">
				<div className="flex items-center gap-2">
					<span className="text-xl">{getSportEmoji(post.sport)}</span>
					<div className="flex flex-col">
						<span className="text-[15px] font-bold">{post.sport}</span>
						<span className="text-sub text-xs">{post.author_name}</span>
					</div>
				</div>
				{showOwnerActions && (
					<Badge variant={post.status === "open" ? "trust" : "neutral"}>
						{STATUS_LABELS[post.status]}
					</Badge>
				)}
			</div>
			<div className="text-sub flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
				<span>{post.region}</span>
				<span className="text-line">·</span>
				<span>{formatPreferredDate(post.preferred_date)}</span>
				<span className="text-line">·</span>
				<span>{getTimeSlotLabel(post.time_slot)}</span>
				<span className="text-line">·</span>
				<span>{getGenderModeLabel(post.gender_mode)}</span>
			</div>
			{post.comment !== "" && <p className="text-body text-sm leading-relaxed">{post.comment}</p>}
			{showOwnerActions && post.status === "open" && (
				<div className="flex gap-2 pt-1">
					<Link
						href={`/sports-mate/${post.id}/edit`}
						className="border-line bg-surface text-body flex h-10 flex-1 items-center justify-center rounded-xl border text-sm font-medium">
						수정
					</Link>
					<Button
						variant="outline"
						size="sm"
						onClick={handleClose}
						isLoading={patchStatusMutation.isPending}
						className="h-10 flex-1">
						모집 마감
					</Button>
				</div>
			)}
		</div>
	);
}
