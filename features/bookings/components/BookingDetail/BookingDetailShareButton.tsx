// features/bookings/components/BookingDetail/BookingDetailShareButton.tsx
"use client";

import type { JSX } from "react";
import { Button } from "@/components/ui/Button";
import { useCreateDateShareLinkMutation } from "@/features/dateShare/mutations";
import { useToastStore } from "@/store/useToastStore";

type BookingDetailShareButtonProps = {
	bookingId: string;
};

// 데이트 일정을 지인에게 공유 — 네이티브 공유 시트가 있으면 그걸, 없으면 링크를
// 클립보드에 복사한다. 링크는 이미 유효한 게 있으면 서버에서 재사용한다.
export function BookingDetailShareButton({
	bookingId,
}: BookingDetailShareButtonProps): JSX.Element {
	const createLinkMutation = useCreateDateShareLinkMutation();
	const showToast = useToastStore(function (state) {
		return state.showToast;
	});

	function handleClick(): void {
		createLinkMutation.mutate(bookingId, {
			onSuccess: async function (link): Promise<void> {
				const url = `${window.location.origin}/shared-date/${link.token}`;
				if (navigator.share) {
					try {
						await navigator.share({ title: "데이트 일정 공유", url });
					} catch {
						// 사용자가 공유 시트를 취소한 경우 — 별도 처리 없음
					}
					return;
				}
				await navigator.clipboard.writeText(url);
				showToast("공유 링크가 복사됐어요");
			},
		});
	}

	return (
		<Button
			variant="outline"
			fullWidth
			isLoading={createLinkMutation.isPending}
			onClick={handleClick}>
			일정 공유하기
		</Button>
	);
}
