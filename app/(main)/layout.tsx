// app/(main)/layout.tsx
import { redirect } from "next/navigation";
import type { JSX, ReactNode } from "react";
import { ToastViewport } from "@/components/commons/ToastViewport";
import { BookingRealtimeListener } from "@/features/bookings/components/BookingRealtimeListener";
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
			{children}
			<BookingRealtimeListener />
			<ToastViewport />
		</div>
	);
}
