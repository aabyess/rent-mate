// features/admin/apis.ts
import type { PendingPartnerItem, ReportItem, ReportStatus } from "@/features/admin/types";
import { createClient } from "@/libs/supabase/client";

async function getNamesByProfileIds(profileIds: string[]): Promise<Map<string, string>> {
	const supabase = createClient();
	if (profileIds.length === 0) {
		return new Map();
	}
	const { data, error } = await supabase
		.from("profiles")
		.select("id, name")
		.in("id", Array.from(new Set(profileIds)));
	if (error) {
		throw error;
	}
	return new Map(
		((data ?? []) as { id: string; name: string }[]).map(function (row) {
			return [row.id, row.name] as const;
		}),
	);
}

export async function getPendingPartners(): Promise<PendingPartnerItem[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("partner_profiles")
		.select("profile_id, nickname, bio, hourly_rate_krw, birth_year, interests, created_at")
		.eq("is_approved", false)
		.order("created_at", { ascending: true });
	if (error) {
		throw error;
	}
	const rows = (data ?? []) as Omit<PendingPartnerItem, "realName">[];

	const nameById = await getNamesByProfileIds(
		rows.map(function (row) {
			return row.profile_id;
		}),
	);
	return rows.map(function (row) {
		return { ...row, realName: nameById.get(row.profile_id) ?? "알 수 없음" };
	});
}

export async function patchPartnerApproval(profileId: string): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase
		.from("partner_profiles")
		.update({ is_approved: true })
		.eq("profile_id", profileId);
	if (error) {
		throw error;
	}
}

export async function deletePartnerProfile(profileId: string): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase.from("partner_profiles").delete().eq("profile_id", profileId);
	if (error) {
		throw error;
	}
}

export async function getReports(): Promise<ReportItem[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("reports")
		.select("id, reporter_id, target_id, booking_id, reason, status, created_at")
		.order("created_at", { ascending: false });
	if (error) {
		throw error;
	}
	const rows = (data ?? []) as Omit<ReportItem, "reporterName" | "targetName">[];

	const nameById = await getNamesByProfileIds(
		rows.flatMap(function (row) {
			return [row.reporter_id, row.target_id];
		}),
	);
	return rows.map(function (row) {
		return {
			...row,
			reporterName: nameById.get(row.reporter_id) ?? "알 수 없음",
			targetName: nameById.get(row.target_id) ?? "알 수 없음",
		};
	});
}

export async function patchReportStatus(reportId: string, status: ReportStatus): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase.from("reports").update({ status }).eq("id", reportId);
	if (error) {
		throw error;
	}
}
