// features/safety/components/BlockConfirmDialog.tsx
"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { JSX } from "react";
import { Button } from "@/components/ui/Button";
import { useCreateBlockMutation } from "@/features/safety/mutations";

// 닫히면 언마운트되는 전제라 열릴 때마다 뮤테이션 상태가 초기화된다
type BlockConfirmDialogProps = {
	onClose: () => void;
	targetId: string;
	targetNickname: string;
};

export function BlockConfirmDialog({
	onClose,
	targetId,
	targetNickname,
}: BlockConfirmDialogProps): JSX.Element {
	const createBlockMutation = useCreateBlockMutation();

	function handleBlockClick(): void {
		createBlockMutation.mutate({ targetId });
	}

	return (
		<Dialog open onClose={onClose} className="relative z-30">
			<div className="fixed inset-0 bg-black/40" aria-hidden="true" />
			<div className="fixed inset-x-0 bottom-0">
				<DialogPanel className="bg-surface mx-auto w-full max-w-md rounded-t-3xl px-5 pt-5 pb-8">
					{createBlockMutation.isSuccess ? (
						<div className="flex flex-col gap-4">
							<DialogTitle className="text-lg font-semibold">차단했어요</DialogTitle>
							<p className="text-sub text-sm">
								{targetNickname}님은 파트너 목록과 채팅 목록에서 더 이상 보이지 않아요. 안전 센터의
								차단 목록에서 언제든 해제할 수 있어요.
							</p>
							<Button fullWidth onClick={onClose}>
								확인
							</Button>
						</div>
					) : (
						<div className="flex flex-col gap-4">
							<DialogTitle className="text-lg font-semibold">
								{targetNickname}님을 차단할까요?
							</DialogTitle>
							<p className="text-sub text-sm">
								차단하면 파트너 목록과 채팅 목록에서 상대가 숨겨져요. 부적절한 행동을 겪으셨다면
								신고도 함께 해주세요.
							</p>
							{createBlockMutation.isError && (
								<p className="text-error-500 text-sm">{createBlockMutation.error.message}</p>
							)}
							<div className="flex gap-2">
								<Button variant="outline" fullWidth onClick={onClose}>
									취소
								</Button>
								<Button
									fullWidth
									disabled={createBlockMutation.isPending}
									onClick={handleBlockClick}
									className="bg-error-500 hover:bg-error-700 active:bg-error-700">
									{createBlockMutation.isPending ? "차단 중..." : "차단하기"}
								</Button>
							</div>
						</div>
					)}
				</DialogPanel>
			</div>
		</Dialog>
	);
}
