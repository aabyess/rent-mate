// app/payments/fail/page.tsx
import Link from "next/link";
import type { JSX } from "react";

const FAIL_MESSAGES: Record<string, string> = {
	invalid_params: "결제 정보가 올바르지 않아요.",
	config: "결제 서버 설정이 아직 완료되지 않았어요. 관리자에게 문의해주세요.",
	confirm_failed: "결제 승인에 실패했어요. 카드사 승인이 거절됐을 수 있어요.",
	record_failed: "결제는 승인됐지만 기록 중 문제가 생겼어요. 고객센터로 문의해주세요.",
};

type PaymentFailPageProps = {
	searchParams: Promise<{ code?: string; message?: string }>;
};

export default async function PaymentFailPage({
	searchParams,
}: PaymentFailPageProps): Promise<JSX.Element> {
	const { code, message } = await searchParams;
	const description =
		(code && FAIL_MESSAGES[code]) || message || "결제가 완료되지 않았어요. 다시 시도해주세요.";

	return (
		<main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-5 px-5">
			<span className="bg-error-500/15 text-error-500 flex size-16 items-center justify-center rounded-full">
				<svg
					width="30"
					height="30"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.4"
					strokeLinecap="round">
					<path d="M6 6l12 12M18 6L6 18" />
				</svg>
			</span>
			<div className="flex flex-col items-center gap-1.5">
				<h1 className="text-xl font-bold">결제에 실패했어요</h1>
				<p className="text-sub text-center text-sm">{description}</p>
			</div>
			<div className="flex w-full max-w-sm flex-col gap-2">
				<Link
					href="/bookings"
					className="bg-brand flex h-12 items-center justify-center rounded-xl font-medium text-white">
					예약 내역으로
				</Link>
				<Link
					href="/"
					className="text-sub flex h-12 items-center justify-center rounded-xl text-sm">
					홈으로
				</Link>
			</div>
		</main>
	);
}
