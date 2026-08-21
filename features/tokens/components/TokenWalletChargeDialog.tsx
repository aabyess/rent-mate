// features/tokens/components/TokenWalletChargeDialog.tsx
"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { JSX } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useMyProfileQuery } from "@/features/auth/queries";
import { startTokenCheckout } from "@/features/payments/apis";
import { formatKrw } from "@/features/partners/utils";
import { useCreateTokenPurchaseMutation } from "@/features/tokens/mutations";
import { TOKEN_PRODUCTS, type TokenProduct } from "@/features/tokens/products";

type TokenWalletChargeDialogProps = {
	onClose: () => void;
};

export function TokenWalletChargeDialog({ onClose }: TokenWalletChargeDialogProps): JSX.Element {
	const { data: myProfile } = useMyProfileQuery();
	const createPurchaseMutation = useCreateTokenPurchaseMutation();
	const [selectedCode, setSelectedCode] = useState<string | null>(null);
	const [checkoutError, setCheckoutError] = useState<string | null>(null);

	function handleSelect(product: TokenProduct): void {
		setSelectedCode(product.code);
		setCheckoutError(null);
		createPurchaseMutation.mutate(product, {
			onSuccess: function (purchaseId): void {
				startTokenCheckout({
					purchaseId,
					customerKey: myProfile?.id ?? purchaseId,
					amountKrw: product.amountKrw,
					orderName: `RentMate 토큰 ${product.tokens}개`,
				}).catch(function (error: Error) {
					setCheckoutError(error.message || "결제창을 열지 못했어요.");
				});
			},
			onError: function (error): void {
				setCheckoutError(error.message || "구매 준비에 실패했어요.");
			},
		});
	}

	return (
		<Dialog open onClose={onClose} className="relative z-30">
			<div className="fixed inset-0 bg-black/40" aria-hidden="true" />
			<div className="fixed inset-x-0 bottom-0">
				<DialogPanel className="bg-surface mx-auto flex w-full max-w-md flex-col gap-4 rounded-t-3xl px-5 pt-5 pb-8">
					<DialogTitle className="text-lg font-semibold">토큰 충전</DialogTitle>
					<div className="flex flex-col gap-2.5">
						{TOKEN_PRODUCTS.map(function (product) {
							const isLoading = selectedCode === product.code && createPurchaseMutation.isPending;
							return (
								<button
									key={product.code}
									type="button"
									disabled={createPurchaseMutation.isPending}
									onClick={function () {
										handleSelect(product);
									}}
									className="bg-surface-alt flex items-center justify-between rounded-2xl px-4 py-3.5 disabled:opacity-60">
									<div className="flex flex-col gap-0.5 text-left">
										<span className="text-[15px] font-semibold">🪙 {product.tokens}개</span>
										{product.bonusLabel && (
											<span className="text-trust text-xs font-medium">{product.bonusLabel}</span>
										)}
									</div>
									<span className="text-[15px] font-bold tabular-nums">
										{isLoading ? "이동 중..." : formatKrw(product.amountKrw)}
									</span>
								</button>
							);
						})}
					</div>
					{checkoutError && <p className="text-error-500 text-sm">{checkoutError}</p>}
					<Button variant="outline" fullWidth onClick={onClose}>
						닫기
					</Button>
				</DialogPanel>
			</div>
		</Dialog>
	);
}
