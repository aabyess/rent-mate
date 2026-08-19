// features/safety/apis.ts
import type {
	BlockedUserItem,
	BlockRow,
	CreateBlockInput,
	CreateReportInput,
	MyReportItem,
} from "@/features/safety/types";
import { createClient } from "@/libs/supabase/client";

const UNKNOWN_NICKNAME = "알 수 없는 사용자";

// 비활성·미승인 파트너는 RLS로 닉네임을 읽을 수 없으므로 조회 가능한 것만 매핑한다
async function getNicknameMap(profileIds: string[]): Promise<Map<string, string>> {
	const supabase = createClient();
	if (profileIds.length === 0) {
		return new Map();
	}

	const { data, error } = await supabase
		.from("partner_profiles")
		.select("profile_id, nickname")
		.in("profile_id", profileIds);
	if (error) {
		throw error;
	}
	return new Map(
		(data ?? []).map(function (row) {
			return [row.profile_id as string, row.nickname as string];
		}),
	);
}

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

export async function getMyReports(): Promise<MyReportItem[]> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return [];
	}

	const { data, error } = await supabase
		.from("reports")
		.select("id, target_id, reason, status, created_at")
		.eq("reporter_id", user.id)
		.order("created_at", { ascending: false });
	if (error) {
		throw error;
	}

	const reports = (data ?? []) as Omit<MyReportItem, "targetNickname">[];
	const nicknameMap = await getNicknameMap(
		reports.map(function (report) {
			return report.target_id;
		}),
	);
	return reports.map(function (report) {
		return { ...report, targetNickname: nicknameMap.get(report.target_id) ?? UNKNOWN_NICKNAME };
	});
}

export async function postCreateBlock({ targetId }: CreateBlockInput): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { error } = await supabase.from("blocks").insert({
		blocker_id: user.id,
		blocked_id: targetId,
	});
	if (error) {
		throw error;
	}
}

export async function deleteBlock(blockId: string): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase.from("blocks").delete().eq("id", blockId);
	if (error) {
		throw error;
	}
}

export async function getMyBlocks(): Promise<BlockedUserItem[]> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return [];
	}

	const { data, error } = await supabase
		.from("blocks")
		.select("id, blocker_id, blocked_id, created_at")
		.eq("blocker_id", user.id)
		.order("created_at", { ascending: false });
	if (error) {
		throw error;
	}

	const blocks = (data ?? []) as BlockRow[];
	const nicknameMap = await getNicknameMap(
		blocks.map(function (block) {
			return block.blocked_id;
		}),
	);
	return blocks.map(function (block) {
		return { ...block, blockedNickname: nicknameMap.get(block.blocked_id) ?? UNKNOWN_NICKNAME };
	});
}
