// app/(main)/layout.tsx
import { redirect } from "next/navigation";
import type { JSX, ReactNode } from "react";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { createClient } from "@/libs/supabase/server";

type MainLayoutProps = {
	children: ReactNode;
};

export default async function MainLayout({ children }: MainLayoutProps): Promise<JSX.Element> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	// 성인인증(온보딩) 미완료 사용자는 서비스 진입 불가
	const { data: profile } = await supabase
		.from("profiles")
		.select("adult_verified_at")
		.eq("id", user.id)
		.maybeSingle();

	if (!profile || !profile.adult_verified_at) {
		redirect("/onboarding");
	}

	return (
		<div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
			<div className="flex-1 pb-24">{children}</div>
			<BottomTabBar />
		</div>
	);
}
