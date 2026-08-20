// features/partners/components/PartnerList/PartnerListRewindDialog.tsx
"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { JSX } from "react";
import { Button } from "@/components/ui/Button";

type PartnerListRewindDialogProps = {
	onClose: () => void;
};

// 되감기 토큰 소진 안내 — 충전(결제)은 추후 기능
export function PartnerListRewindDialog({ onClose }: PartnerListRewindDialogProps): JSX.Element {
	return (
		<Dialog open onClose={onClose} className="relative z-30">
			<div className="fixed inset-0 bg-black/40" aria-hidden="true" />
			<div className="fixed inset-x-0 bottom-0">
				<DialogPanel className="bg-surface mx-auto flex w-full max-w-md flex-col gap-4 rounded-t-3xl px-5 pt-5 pb-8">
					<DialogTitle className="text-lg font-semibold">되감기 토큰을 다 썼어요</DialogTitle>
					<p className="text-sub text-sm leading-relaxed">
						이전 카드로 돌아가려면 토큰 1개가 필요해요. 토큰 충전 기능은 준비 중이에요 — 조금만
						기다려주세요!
					</p>
					<Button fullWidth onClick={onClose}>
						확인
					</Button>
				</DialogPanel>
			</div>
		</Dialog>
	);
}
