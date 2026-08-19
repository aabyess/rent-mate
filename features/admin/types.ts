// features/admin/types.ts

export type ReportStatus = "open" | "resolved" | "dismissed";

export type PendingPartnerItem = {
	profile_id: string;
	nickname: string;
	bio: string;
	hourly_rate_krw: number;
	birth_year: number | null;
	interests: string[];
	created_at: string;
	realName: string;
};

export type ReportItem = {
	id: string;
	reporter_id: string;
	target_id: string;
	booking_id: string | null;
	reason: string;
	status: ReportStatus;
	created_at: string;
	reporterName: string;
	targetName: string;
};
