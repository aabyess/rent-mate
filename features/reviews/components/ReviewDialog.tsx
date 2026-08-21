// features/reviews/components/ReviewDialog.tsx
"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { ReviewStars } from "@/features/reviews/components/ReviewStars";
import { useCreateReviewMutation } from "@/features/reviews/mutations";
import { findAppearanceKeyword } from "@/utils/appearanceKeywords";
import { findBannedPhrase } from "@/utils/bannedPhrases";

const REVIEW_REWARD_MIN_LENGTH = 20;

// 닫히면 언마운트되는 전제라 열릴 때마다 입력·뮤테이션 상태가 초기화된다
type ReviewDialogProps = {
	onClose: () => void;
	bookingId: string;
	partnerId: string;
	partnerName: string;
};

type AxisKey = "timeliness" | "manner" | "safety" | "wouldMeetAgain";

const AXES: { key: AxisKey; label: string }[] = [
	{ key: "timeliness", label: "시간 약속" },
	{ key: "manner", label: "대화·매너" },
	{ key: "safety", label: "안전하다고 느꼈어요" },
	{ key: "wouldMeetAgain", label: "다시 만나고 싶어요" },
];

export function ReviewDialog({
	onClose,
	bookingId,
	partnerId,
	partnerName,
}: ReviewDialogProps): JSX.Element {
	const createReviewMutation = useCreateReviewMutation();
	const [axisRatings, setAxisRatings] = useState<Record<AxisKey, number>>({
		timeliness: 0,
		manner: 0,
		safety: 0,
		wouldMeetAgain: 0,
	});
	const [content, setContent] = useState("");
	const [bannedPhrase, setBannedPhrase] = useState<string | null>(null);

	const isAllRated = AXES.every(function (axis) {
		return axisRatings[axis.key] > 0;
	});
	const appearanceKeyword = findAppearanceKeyword(content);
	const isRewardEarned = content.trim().length >= REVIEW_REWARD_MIN_LENGTH;

	function handleAxisSelect(key: AxisKey, value: number): void {
		setAxisRatings(function (current) {
			return { ...current, [key]: value };
		});
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		if (!isAllRated) {
			return;
		}
		// 후기도 공개 지면이므로 성매매 연상 표현을 차단한다 (DB 트리거와 이중 방어)
		const banned = findBannedPhrase(content);
		if (banned !== null) {
			setBannedPhrase(banned);
			return;
		}
		setBannedPhrase(null);
		createReviewMutation.mutate({
			bookingId,
			partnerId,
			timelinessRating: axisRatings.timeliness,
			mannerRating: axisRatings.manner,
			safetyRating: axisRatings.safety,
			wouldMeetAgainRating: axisRatings.wouldMeetAgain,
			content,
		});
	}

	return (
		<Dialog open onClose={onClose} className="relative z-30">
			<div className="fixed inset-0 bg-black/40" aria-hidden="true" />
			<div className="fixed inset-x-0 bottom-0">
				<DialogPanel className="bg-surface mx-auto w-full max-w-md rounded-t-3xl px-5 pt-5 pb-8">
					{createReviewMutation.isSuccess ? (
						<div className="flex flex-col gap-4">
							<DialogTitle className="text-lg font-semibold">후기가 등록됐어요</DialogTitle>
							<p className="text-sub text-sm">
								소중한 후기 감사합니다. 다른 고객이 파트너를 선택하는 데 큰 도움이 돼요.
							</p>
							{isRewardEarned && (
								<p className="text-trust text-sm font-semibold">🪙 토큰 20개가 적립됐어요!</p>
							)}
							<Button fullWidth onClick={onClose}>
								확인
							</Button>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="flex flex-col gap-4">
							<DialogTitle className="text-lg font-semibold">
								{partnerName}님과의 데이트, 어떠셨나요?
							</DialogTitle>
							<div className="flex flex-col gap-3">
								{AXES.map(function (axis) {
									return (
										<div key={axis.key} className="flex items-center justify-between gap-2">
											<span className="text-sm font-medium">{axis.label}</span>
											<ReviewStars
												rating={axisRatings[axis.key]}
												size={22}
												onSelect={function (value) {
													handleAxisSelect(axis.key, value);
												}}
											/>
										</div>
									);
								})}
							</div>
							<textarea
								value={content}
								onChange={function (event) {
									setContent(event.target.value);
								}}
								placeholder="좋았던 점을 남겨주세요 (선택)"
								rows={4}
								className="bg-surface-alt text-body placeholder:text-sub w-full resize-none rounded-xl p-4 text-base focus:outline-none"
							/>
							<p className="text-sub text-xs">
								{REVIEW_REWARD_MIN_LENGTH}자 이상 정성 후기에 토큰 20개를 드려요
							</p>
							{appearanceKeyword !== null && (
								<p className="text-warning-500 text-xs">
									외모보다 매너·대화·시간약속 경험을 남겨주세요
								</p>
							)}
							{bannedPhrase !== null && (
								<p className="text-error-500 text-sm">
									&lsquo;{bannedPhrase}&rsquo; 표현은 후기에 사용할 수 없어요.
								</p>
							)}
							{createReviewMutation.isError && (
								<p className="text-error-500 text-sm">{createReviewMutation.error.message}</p>
							)}
							<div className="flex gap-2">
								<Button variant="outline" fullWidth onClick={onClose}>
									취소
								</Button>
								<Button
									type="submit"
									fullWidth
									disabled={!isAllRated}
									isLoading={createReviewMutation.isPending}>
									후기 등록
								</Button>
							</div>
						</form>
					)}
				</DialogPanel>
			</div>
		</Dialog>
	);
}
