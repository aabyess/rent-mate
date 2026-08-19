// features/partners/apis.ts
import type { PartnerListItem } from "@/features/partners/types";
import { createClient } from "@/libs/supabase/client";

export async function getPartnerList(): Promise<PartnerListItem[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("partner_profiles")
		.select(
			"profile_id, nickname, bio, hourly_rate_krw, photo_urls, birth_year, interests, created_at",
		)
		.eq("is_approved", true)
		.eq("is_active", true)
		.order("created_at", { ascending: false });
	if (error) {
		throw error;
	}
	return (data ?? []) as PartnerListItem[];
}
