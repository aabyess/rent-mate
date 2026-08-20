// features/safety/components/ReportDialog.tsx
"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { useCreateReportMutation } from "@/features/safety/mutations";

// 닫히면 언마운트되는 전제라 열릴 때마다 입력·뮤테이션 상태가 초기화된다
type ReportDialogProps = {
	onClose: () => void;
	targetId: string;
	targetNickname: string;
	/** 신고 대상 맥락(예: 후기 ID) — 접수 사유 앞에 붙어 운영팀이 대상을 특정할 수 있게 한다 */
	reasonContext?: string;
};

export function ReportDialog({
	onClose,
	targetId,
	targetNickname,
	reasonContext,
}: ReportDialogProps): JSX.Element {
	const createReportMutation = useCreateReportMutation();
	const [reason, setReason] = useState("");

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		const finalReason = reasonContext ? `[${reasonContext}] ${reason}` : reason;
		createReportMutation.mutate({ targetId, reason: finalReason });
	}

	return (
		<Dialog open onClose={onClose} className="relative z-30">
			<div className="fixed inset-0 bg-black/40" aria-hidden="true" />
			<div className="fixed inset-x-0 bottom-0">
				<DialogPanel className="bg-surface mx-auto w-full max-w-md rounded-t-3xl px-5 pt-5 pb-8">
					{createReportMutation.isSuccess ? (
						<div className="flex flex-col gap-4">
							<DialogTitle className="text-lg font-semibold">신고가 접수됐어요</DialogTitle>
							<p className="text-sub text-sm">
								운영팀이 확인 후 조치할 예정이에요. 소중한 신고 감사합니다.
							</p>
							<Button fullWidth onClick={onClose}>
								확인
							</Button>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="flex flex-col gap-4">
							<DialogTitle className="text-lg font-semibold">
								{targetNickname}님 신고하기
							</DialogTitle>
							<p className="text-sub text-sm">
								조건만남 유도, 부적절한 언행 등 금지 행위를 발견하셨다면 알려주세요. 신고 내용은
								운영팀만 볼 수 있어요.
							</p>
							<textarea
								value={reason}
								onChange={function (event) {
									setReason(event.target.value);
								}}
								placeholder="신고 사유를 입력해주세요 (최소 5자)"
								required
								minLength={5}
								rows={4}
								className="bg-surface-alt text-body placeholder:text-sub w-full resize-none rounded-xl p-4 text-base focus:outline-none"
							/>
							{createReportMutation.isError && (
								<p className="text-error-500 text-sm">{createReportMutation.error.message}</p>
							)}
							<div className="flex gap-2">
								<Button variant="outline" fullWidth onClick={onClose}>
									취소
								</Button>
								<Button
									type="submit"
									fullWidth
									isLoading={createReportMutation.isPending}
									className="bg-error-500 hover:bg-error-700 active:bg-error-700">
									{createReportMutation.isPending ? "접수 중..." : "신고하기"}
								</Button>
							</div>
						</form>
					)}
				</DialogPanel>
			</div>
		</Dialog>
	);
}
