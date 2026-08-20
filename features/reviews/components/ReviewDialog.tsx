// features/reviews/components/ReviewDialog.tsx
"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { ReviewStars } from "@/features/reviews/components/ReviewStars";
import { useCreateReviewMutation } from "@/features/reviews/mutations";
import { findBannedPhrase } from "@/utils/bannedPhrases";

// 닫히면 언마운트되는 전제라 열릴 때마다 입력·뮤테이션 상태가 초기화된다
type ReviewDialogProps = {
	onClose: () => void;
	bookingId: string;
	partnerId: string;
	partnerName: string;
};

export function ReviewDialog({
	onClose,
	bookingId,
	partnerId,
	partnerName,
}: ReviewDialogProps): JSX.Element {
	const createReviewMutation = useCreateReviewMutation();
	const [rating, setRating] = useState(0);
	const [content, setContent] = useState("");
	const [bannedPhrase, setBannedPhrase] = useState<string | null>(null);

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		if (rating === 0) {
			return;
		}
		// 후기도 공개 지면이므로 성매매 연상 표현을 차단한다 (DB 트리거와 이중 방어)
		const banned = findBannedPhrase(content);
		if (banned !== null) {
			setBannedPhrase(banned);
			return;
		}
		setBannedPhrase(null);
		createReviewMutation.mutate({ bookingId, partnerId, rating, content });
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
							<Button fullWidth onClick={onClose}>
								확인
							</Button>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="flex flex-col gap-4">
							<DialogTitle className="text-lg font-semibold">
								{partnerName}님과의 데이트, 어떠셨나요?
							</DialogTitle>
							<div className="flex justify-center py-2">
								<ReviewStars rating={rating} size={32} onSelect={setRating} />
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
									disabled={rating === 0}
									isLoading={createReviewMutation.isPending}>
									{createReviewMutation.isPending ? "등록 중..." : "후기 등록"}
								</Button>
							</div>
						</form>
					)}
				</DialogPanel>
			</div>
		</Dialog>
	);
}
