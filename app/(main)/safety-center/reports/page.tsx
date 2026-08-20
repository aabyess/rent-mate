// app/(main)/safety-center/reports/page.tsx
import type { JSX } from "react";
import { BackButton } from "@/components/commons/BackButton";
import { SafetyCenterReportList } from "@/features/safety/components/SafetyCenter/SafetyCenterReportList";

export default function SafetyCenterReportsPage(): JSX.Element {
	return (
		<main className="flex flex-col gap-5 px-5 py-4 pb-16">
			<div className="flex items-center gap-3">
				<BackButton ariaLabel="이전 화면으로 돌아가기" />
				<h1 className="text-lg font-bold">신고 내역</h1>
			</div>
			<SafetyCenterReportList />
		</main>
	);
}
