// features/sportsMate/components/SportsMatePostList/SportsMatePostListCard.tsx
import Link from "next/link";
import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SportsMatePostListCardRequests } from "@/features/sportsMate/components/SportsMatePostList/SportsMatePostListCardRequests";
import {
	useCreateSportsMateRequestMutation,
	usePatchSportsMatePostStatusMutation,
} from "@/features/sportsMate/mutations";
import type { SportsMatePost, SportsMateRequestStatus } from "@/features/sportsMate/types";
import {
	formatPreferredDate,
	getGenderModeLabel,
	getSportEmoji,
	getTimeSlotLabel,
} from "@/features/sportsMate/utils";
import { useToastStore } from "@/store/useToastStore";

type SportsMatePostListCardProps = {
	post: SportsMatePost;
	mode: "all" | "mine";
	/** mode가 "all"일 때만 의미 있음 — 내가 이 글에 이미 신청했는지 */
	myRequestStatus?: SportsMateRequestStatus;
};

const STATUS_LABELS: Record<SportsMatePost["status"], string> = {
	open: "모집 중",
	matched: "매칭 완료",
	closed: "마감",
};

const REQUEST_BUTTON_LABELS: Record<SportsMateRequestStatus, string> = {
	pending: "신청 완료",
	accepted: "매칭됨",
	declined: "신청 거절됨",
	cancelled: "신청 취소함",
};

export function SportsMatePostListCard({
	post,
	mode,
	myRequestStatus,
}: SportsMatePostListCardProps): JSX.Element {
	const patchStatusMutation = usePatchSportsMatePostStatusMutation();
	const createRequestMutation = useCreateSportsMateRequestMutation();
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

	function handleRequest(): void {
		createRequestMutation.mutate(post.id, {
			onSuccess: function (): void {
				showToast("신청했어요");
			},
		});
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
				{mode === "mine" && (
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

			{mode === "all" &&
				(myRequestStatus ? (
					<div className="bg-surface-alt text-sub flex h-10 items-center justify-center rounded-xl text-sm font-medium">
						{REQUEST_BUTTON_LABELS[myRequestStatus]}
					</div>
				) : (
					<Button
						fullWidth
						size="sm"
						className="h-10"
						onClick={handleRequest}
						isLoading={createRequestMutation.isPending}>
						같이 하고 싶어요
					</Button>
				))}
			{mode === "all" && createRequestMutation.isError && (
				<p className="text-error-500 text-xs">{createRequestMutation.error.message}</p>
			)}

			{mode === "mine" && post.status === "open" && (
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
			{mode === "mine" && <SportsMatePostListCardRequests post={post} />}
		</div>
	);
}
