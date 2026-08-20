// app/(main)/wallet/page.tsx
import type { JSX } from "react";
import { BackButton } from "@/components/commons/BackButton";
import { TokenWallet } from "@/features/tokens/components/TokenWallet";

export default function WalletPage(): JSX.Element {
	return (
		<main className="flex flex-col gap-5 px-5 py-4 pb-16">
			<div className="flex items-center gap-3">
				<BackButton ariaLabel="이전 화면으로 돌아가기" />
				<h1 className="text-lg font-bold">토큰 지갑</h1>
			</div>
			<TokenWallet />
		</main>
	);
}
