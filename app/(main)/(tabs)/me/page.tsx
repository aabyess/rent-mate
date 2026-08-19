// app/(main)/(tabs)/me/page.tsx
import type { JSX } from "react";
import { MyPageContent } from "@/features/auth/components/MyPageContent";

export default function MyPage(): JSX.Element {
	return (
		<main className="flex flex-col gap-4 px-5 py-4">
			<h1 className="text-[28px] font-bold">마이페이지</h1>
			<MyPageContent />
		</main>
	);
}
