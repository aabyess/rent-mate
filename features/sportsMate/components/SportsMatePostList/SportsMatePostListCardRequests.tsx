// features/sportsMate/components/SportsMatePostList/SportsMatePostListCardRequests.tsx
import Link from "next/link";
import type { JSX } from "react";
import { Button } from "@/components/ui/Button";
import {
	useAcceptSportsMateRequestMutation,
	usePatchSportsMateRequestStatusMutation,
} from "@/features/sportsMate/mutations";
import { useSportsMatePostRequestsQuery } from "@/features/sportsMate/queries";
import type { SportsMatePost } from "@/features/sportsMate/types";

type SportsMatePostListCardRequestsProps = {
	post: SportsMatePost;
};

// 내 모집글 카드 안에 접히지 않고 항상 펼쳐 보여주는 신청 관리 섹션 —
// open이면 수락 대기 신청 목록, matched면 수락된 신청으로 바로 채팅 진입
export function SportsMatePostListCardRequests({
	post,
}: SportsMatePostListCardRequestsProps): JSX.Element | null {
	const { data: requests, isPending } = useSportsMatePostRequestsQuery(post.id);
	const acceptMutation = useAcceptSportsMateRequestMutation(post.id);
	const declineMutation = usePatchSportsMateRequestStatusMutation(post.id);

	if (isPending || !requests || requests.length === 0) {
		return null;
	}

	if (post.status === "matched") {
		const accepted = requests.find(function (request) {
			return request.status === "accepted";
		});
		if (!accepted) {
			return null;
		}
		return (
			<Link
				href={`/sports-mate/requests/${accepted.id}/chat`}
				className="bg-brand-subtle text-brand flex h-11 items-center justify-center rounded-xl text-sm font-semibold">
				{accepted.requester_name}님과 채팅하기
			</Link>
		);
	}

	const pending = requests.filter(function (request) {
		return request.status === "pending";
	});
	if (pending.length === 0) {
		return null;
	}

	return (
		<div className="border-line flex flex-col gap-2 border-t pt-3">
			<span className="text-sub text-xs font-semibold">신청 {pending.length}건</span>
			{pending.map(function (request) {
				return (
					<div key={request.id} className="flex items-center gap-2">
						<span className="flex-1 text-sm">{request.requester_name}</span>
						<Button
							size="sm"
							variant="outline"
							onClick={function () {
								declineMutation.mutate({ requestId: request.id, status: "declined" });
							}}
							isLoading={declineMutation.isPending}>
							거절
						</Button>
						<Button
							size="sm"
							onClick={function () {
								acceptMutation.mutate(request.id);
							}}
							isLoading={acceptMutation.isPending}>
							수락
						</Button>
					</div>
				);
			})}
			{acceptMutation.isError && (
				<p className="text-error-500 text-xs">{acceptMutation.error.message}</p>
			)}
		</div>
	);
}
