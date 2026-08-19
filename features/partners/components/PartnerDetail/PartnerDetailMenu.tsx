// features/partners/components/PartnerDetail/PartnerDetailMenu.tsx
"use client";

import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
} from "@headlessui/react";
import { useState, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { useCreateReportMutation } from "@/features/safety/mutations";

type PartnerDetailMenuProps = {
	targetId: string;
	targetNickname: string;
};

export function PartnerDetailMenu({
	targetId,
	targetNickname,
}: PartnerDetailMenuProps): JSX.Element {
	const createReportMutation = useCreateReportMutation();
	const [isReportOpen, setIsReportOpen] = useState(false);
	const [reason, setReason] = useState("");

	function handleReportOpen(): void {
		createReportMutation.reset();
		setReason("");
		setIsReportOpen(true);
	}

	function handleReportClose(): void {
		setIsReportOpen(false);
	}

	function handleReportSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		createReportMutation.mutate({ targetId, reason });
	}

	return (
		<>
			<Menu>
				<MenuButton
					aria-label="더보기 메뉴"
					className="flex size-10 items-center justify-center rounded-full bg-white/90">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="#18181b">
						<circle cx="5" cy="12" r="1.8" />
						<circle cx="12" cy="12" r="1.8" />
						<circle cx="19" cy="12" r="1.8" />
					</svg>
				</MenuButton>
				<MenuItems
					anchor="bottom end"
					className="bg-surface z-20 mt-1 w-36 rounded-xl p-1 shadow-lg">
					<MenuItem>
						<button
							type="button"
							onClick={handleReportOpen}
							className="text-error-500 data-focus:bg-surface-alt w-full rounded-lg px-3 py-2.5 text-left text-sm">
							신고하기
						</button>
					</MenuItem>
				</MenuItems>
			</Menu>

			<Dialog open={isReportOpen} onClose={handleReportClose} className="relative z-30">
				<div className="fixed inset-0 bg-black/40" aria-hidden="true" />
				<div className="fixed inset-x-0 bottom-0">
					<DialogPanel className="bg-surface mx-auto w-full max-w-md rounded-t-3xl px-5 pt-5 pb-8">
						{createReportMutation.isSuccess ? (
							<div className="flex flex-col gap-4">
								<DialogTitle className="text-lg font-semibold">신고가 접수됐어요</DialogTitle>
								<p className="text-sub text-sm">
									운영팀이 확인 후 조치할 예정이에요. 소중한 신고 감사합니다.
								</p>
								<Button fullWidth onClick={handleReportClose}>
									확인
								</Button>
							</div>
						) : (
							<form onSubmit={handleReportSubmit} className="flex flex-col gap-4">
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
									<Button variant="outline" fullWidth onClick={handleReportClose}>
										취소
									</Button>
									<Button
										type="submit"
										fullWidth
										disabled={createReportMutation.isPending}
										className="bg-error-500 hover:bg-error-700 active:bg-error-700">
										{createReportMutation.isPending ? "접수 중..." : "신고하기"}
									</Button>
								</div>
							</form>
						)}
					</DialogPanel>
				</div>
			</Dialog>
		</>
	);
}
