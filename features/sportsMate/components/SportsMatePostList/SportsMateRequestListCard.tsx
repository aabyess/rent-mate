// features/sportsMate/components/SportsMatePostList/SportsMateRequestListCard.tsx
import Link from "next/link";
import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { usePatchSportsMateRequestStatusMutation } from "@/features/sportsMate/mutations";
import type { MySportsMateRequestItem } from "@/features/sportsMate/types";
import {
	formatPreferredDate,
	getGenderModeLabel,
	getSportEmoji,
	getTimeSlotLabel,
} from "@/features/sportsMate/utils";

type SportsMateRequestListCardProps = {
	request: MySportsMateRequestItem;
};

const STATUS_LABELS: Record<MySportsMateRequestItem["status"], string> = {
	pending: "수락 대기 중",
	accepted: "매칭 완료",
	declined: "신청 거절됨",
	cancelled: "신청 취소함",
};

export function SportsMateRequestListCard({
	request,
}: SportsMateRequestListCardProps): JSX.Element {
	const patchStatusMutation = usePatchSportsMateRequestStatusMutation(request.post_id);
	const { post } = request;

	function handleCancel(): void {
		patchStatusMutation.mutate({ requestId: request.id, status: "cancelled" });
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
				<Badge variant={request.status === "accepted" ? "trust" : "neutral"}>
					{STATUS_LABELS[request.status]}
				</Badge>
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
			{request.status === "accepted" && (
				<Link
					href={`/sports-mate/requests/${request.id}/chat`}
					className="bg-brand-subtle text-brand flex h-10 items-center justify-center rounded-xl text-sm font-semibold">
					채팅하기
				</Link>
			)}
			{request.status === "pending" && (
				<Button
					variant="outline"
					size="sm"
					className="h-10"
					onClick={handleCancel}
					isLoading={patchStatusMutation.isPending}>
					신청 취소
				</Button>
			)}
		</div>
	);
}
