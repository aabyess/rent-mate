// app/(main)/admin/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import type { JSX } from "react";
import { AdminDashboard } from "@/features/admin/components/AdminDashboard";
import { createClient } from "@/libs/supabase/server";

export default async function AdminPage(): Promise<JSX.Element> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		redirect("/login");
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.maybeSingle();
	if (!profile || profile.role !== "admin") {
		redirect("/");
	}

	return (
		<main className="flex flex-col gap-5 px-5 py-4 pb-16">
			<div className="flex items-center gap-3">
				<Link href="/me" aria-label="마이페이지로 돌아가기">
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M15 5l-7 7 7 7" />
					</svg>
				</Link>
				<h1 className="text-lg font-bold">관리자</h1>
			</div>
			<AdminDashboard />
		</main>
	);
}
