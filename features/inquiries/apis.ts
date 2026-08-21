// features/inquiries/apis.ts
import type { AdminInquiryItem, CreateInquiryInput, InquiryRow } from "@/features/inquiries/types";
import { createClient } from "@/libs/supabase/client";

export async function getMyInquiries(): Promise<InquiryRow[]> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return [];
	}
	const { data, error } = await supabase
		.from("inquiries")
		.select("id, category, content, status, answer, answered_at, created_at")
		.eq("profile_id", user.id)
		.order("created_at", { ascending: false });
	if (error) {
		throw error;
	}
	return (data ?? []) as InquiryRow[];
}

export async function postCreateInquiry({ category, content }: CreateInquiryInput): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}
	const { error } = await supabase.from("inquiries").insert({
		profile_id: user.id,
		category,
		content,
	});
	if (error) {
		throw error;
	}
}

export async function getAdminInquiries(): Promise<AdminInquiryItem[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("inquiries")
		.select("id, profile_id, category, content, status, answer, answered_at, created_at")
		.order("created_at", { ascending: false })
		.limit(50);
	if (error) {
		throw error;
	}
	const rows = (data ?? []) as Omit<AdminInquiryItem, "authorName">[];
	const profileIds = Array.from(
		new Set(
			rows.map(function (row) {
				return row.profile_id;
			}),
		),
	);
	if (profileIds.length === 0) {
		return [];
	}
	const { data: profiles, error: profilesError } = await supabase
		.from("profiles")
		.select("id, name")
		.in("id", profileIds);
	if (profilesError) {
		throw profilesError;
	}
	const nameById = new Map(
		((profiles ?? []) as { id: string; name: string }[]).map(function (profile) {
			return [profile.id, profile.name] as const;
		}),
	);
	return rows.map(function (row) {
		return { ...row, authorName: nameById.get(row.profile_id) ?? "알 수 없음" };
	});
}

export async function patchInquiryAnswer(inquiryId: string, answer: string): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase
		.from("inquiries")
		.update({ answer, status: "answered", answered_at: new Date().toISOString() })
		.eq("id", inquiryId);
	if (error) {
		throw error;
	}
}
