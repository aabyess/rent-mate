// app/(main)/safety-center/blocks/page.tsx
import type { JSX } from "react";
import { BackButton } from "@/components/commons/BackButton";
import { SafetyCenterBlockList } from "@/features/safety/components/SafetyCenter/SafetyCenterBlockList";

export default function SafetyCenterBlocksPage(): JSX.Element {
	return (
		<main className="flex flex-col gap-5 px-5 py-4 pb-16">
			<div className="flex items-center gap-3">
				<BackButton ariaLabel="이전 화면으로 돌아가기" />
				<h1 className="text-lg font-bold">차단 목록</h1>
			</div>
			<SafetyCenterBlockList />
		</main>
	);
}
