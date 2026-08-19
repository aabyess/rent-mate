// features/admin/utils.ts
import type { ReportStatus } from "@/features/admin/types";

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
	open: "접수됨",
	resolved: "조치 완료",
	dismissed: "기각",
};
