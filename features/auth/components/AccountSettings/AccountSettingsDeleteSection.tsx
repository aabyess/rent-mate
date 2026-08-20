// features/auth/components/AccountSettings/AccountSettingsDeleteSection.tsx
"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useState, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { useDeleteAccountMutation } from "@/features/auth/mutations";

// 탈퇴는 소극적으로 배치하되(디자인 가이드), 확인 다이얼로그에서 보존·제한 사항을 명확히 고지한다
export function AccountSettingsDeleteSection(): JSX.Element {
	const router = useRouter();
	const deleteAccountMutation = useDeleteAccountMutation();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	function handleConfirmDelete(): void {
		deleteAccountMutation.mutate(undefined, {
			onSuccess: function () {
				router.replace("/login");
			},
		});
	}

	function handleClose(): void {
		if (!deleteAccountMutation.isPending) {
			setIsDialogOpen(false);
		}
	}

	return (
		<section className="flex flex-col items-center pt-2 pb-4">
			<button
				type="button"
				onClick={function () {
					setIsDialogOpen(true);
				}}
				className="text-sub text-[13px] underline underline-offset-2">
				회원 탈퇴
			</button>

			{isDialogOpen && (
				<Dialog open onClose={handleClose} className="relative z-30">
					<div className="fixed inset-0 bg-black/40" aria-hidden="true" />
					<div className="fixed inset-x-0 bottom-0">
						<DialogPanel className="bg-surface mx-auto w-full max-w-md rounded-t-3xl px-5 pt-5 pb-8">
							<div className="flex flex-col gap-4">
								<DialogTitle className="text-lg font-semibold">정말 탈퇴하시겠어요?</DialogTitle>
								<ul className="text-sub flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed">
									<li>탈퇴 후에는 같은 계정으로 다시 로그인할 수 없어요.</li>
									<li>이름·연락처·프로필 사진 등 개인정보는 즉시 익명 처리돼요.</li>
									<li>채팅 기록은 청소년 보호 관련 법령에 따라 삭제되지 않고 보존돼요.</li>
									<li>작성한 후기는 익명으로 남아요.</li>
									<li>진행 중인 예약이 있으면 먼저 취소하거나 완료해야 해요.</li>
								</ul>
								{deleteAccountMutation.isError && (
									<p className="text-error-500 text-sm">{deleteAccountMutation.error.message}</p>
								)}
								<div className="flex gap-2">
									<Button
										variant="outline"
										fullWidth
										disabled={deleteAccountMutation.isPending}
										onClick={handleClose}>
										돌아가기
									</Button>
									<Button
										fullWidth
										isLoading={deleteAccountMutation.isPending}
										onClick={handleConfirmDelete}>
										{deleteAccountMutation.isPending ? "처리 중..." : "탈퇴하기"}
									</Button>
								</div>
							</div>
						</DialogPanel>
					</div>
				</Dialog>
			)}
		</section>
	);
}
