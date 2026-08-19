// features/safety/apis.ts
import type { CreateReportInput } from "@/features/safety/types";
import { createClient } from "@/libs/supabase/client";

export async function postCreateReport({ targetId, reason }: CreateReportInput): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { error } = await supabase.from("reports").insert({
		reporter_id: user.id,
		target_id: targetId,
		reason,
	});
	if (error) {
		throw error;
	}
}
