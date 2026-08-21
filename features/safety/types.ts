// features/safety/types.ts

export type CreateReportInput = {
	targetId: string;
	reason: string;
};

export type ReportStatus = "open" | "resolved" | "dismissed" | "canceled";

export type MyReportItem = {
	id: string;
	target_id: string;
	reason: string;
	status: ReportStatus;
	created_at: string;
	targetNickname: string;
};

export type CreateBlockInput = {
	targetId: string;
};

export type BlockRow = {
	id: string;
	blocker_id: string;
	blocked_id: string;
	created_at: string;
};

export type BlockedUserItem = BlockRow & {
	blockedNickname: string;
};
