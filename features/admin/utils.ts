// features/admin/utils.ts
import type { ReportContext, ReportStatus } from "@/features/admin/types";

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
	open: "접수됨",
	resolved: "조치 완료",
	dismissed: "기각",
};

const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

// ReportDialog가 만드는 "[라벨 uuid] 사유" 프리픽스를 파싱한다 — 정식 스키마 없이
// 클라이언트에서만 해석하는 컨벤션이라, 라벨 문구가 바뀌면 이 함수도 같이 바꿔야 한다.
export function parseReportContext(reason: string): ReportContext | null {
	const bracketMatch = reason.match(/^\[([^\]]+)\]/);
	if (!bracketMatch) {
		return null;
	}
	const label = bracketMatch[1];
	const idMatch = label.match(UUID_PATTERN);
	if (!idMatch) {
		return null;
	}
	const id = idMatch[0];
	if (label.includes("후기")) {
		return { type: "review", id };
	}
	if (label.includes("채팅")) {
		return { type: "chat_message", id };
	}
	if (label.includes("일기")) {
		return { type: "diary", id };
	}
	return null;
}
