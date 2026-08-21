// features/safety/components/ReportCancelConfirmDialog.tsx
"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { JSX } from "react";
import { Button } from "@/components/ui/Button";
import { useCancelReportMutation } from "@/features/safety/mutations";

// 닫히면 언마운트되는 전제라 열릴 때마다 뮤테이션 상태가 초기화된다
type ReportCancelConfirmDialogProps = {
	onClose: () => void;
	reportId: string;
};

export function ReportCancelConfirmDialog({
	onClose,
	reportId,
}: ReportCancelConfirmDialogProps): JSX.Element {
	const cancelReportMutation = useCancelReportMutation();

	function handleCancelClick(): void {
		cancelReportMutation.mutate(reportId);
	}

	return (
		<Dialog open onClose={onClose} className="relative z-30">
			<div className="fixed inset-0 bg-black/40" aria-hidden="true" />
			<div className="fixed inset-x-0 bottom-0">
				<DialogPanel className="bg-surface mx-auto w-full max-w-md rounded-t-3xl px-5 pt-5 pb-8">
					{cancelReportMutation.isSuccess ? (
						<div className="flex flex-col gap-4">
							<DialogTitle className="text-lg font-semibold">신고를 취소했어요</DialogTitle>
							<Button fullWidth onClick={onClose}>
								확인
							</Button>
						</div>
					) : (
						<div className="flex flex-col gap-4">
							<DialogTitle className="text-lg font-semibold">신고를 취소할까요?</DialogTitle>
							<p className="text-sub text-sm">
								취소하면 이 신고는 처리되지 않아요. 신고 내역에는 취소됨으로 남아요.
							</p>
							{cancelReportMutation.isError && (
								<p className="text-error-500 text-sm">{cancelReportMutation.error.message}</p>
							)}
							<div className="flex gap-2">
								<Button variant="outline" fullWidth onClick={onClose}>
									돌아가기
								</Button>
								<Button
									fullWidth
									isLoading={cancelReportMutation.isPending}
									onClick={handleCancelClick}>
									{cancelReportMutation.isPending ? "취소 중..." : "신고 취소"}
								</Button>
							</div>
						</div>
					)}
				</DialogPanel>
			</div>
		</Dialog>
	);
}
