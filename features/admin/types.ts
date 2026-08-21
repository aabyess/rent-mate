// features/admin/types.ts
import type { BookingStatus } from "@/features/bookings/types";
import type { PaymentRow } from "@/features/payments/types";

export type ReportStatus = "open" | "resolved" | "dismissed" | "canceled";

export type AdminMetrics = {
	pendingPartnerCount: number;
	pendingPartnerOldestAt: string | null;
	openReportCount: number;
	openReportOldestAt: string | null;
	flaggedMessageCount: number;
	flaggedMessageOldestAt: string | null;
	safetyFlaggedReviewCount: number;
	safetyFlaggedReviewOldestAt: string | null;
	activePartnerCount: number;
	todaySignupCount: number;
	todayBookingCount: number;
};

export type AdminPaymentItem = PaymentRow & {
	bookingStatus: BookingStatus;
	customerName: string;
	needsRefund: boolean;
	canRelease: boolean;
};

export type PendingPartnerItem = {
	profile_id: string;
	nickname: string;
	bio: string;
	hourly_rate_krw: number;
	birth_year: number | null;
	interests: string[];
	photo_urls: string[];
	gender: "male" | "female";
	region: string;
	purpose_tags: string[];
	created_at: string;
	realName: string;
};

export type FlaggedMessageItem = {
	id: string;
	booking_id: string;
	sender_id: string;
	content: string;
	created_at: string;
	senderName: string;
};

export type ReportContextType = "review" | "chat_message" | "diary";

export type ReportContext = {
	type: ReportContextType;
	id: string;
};

export type ReportContextContent = {
	content: string | null;
	imagePath: string | null;
};

export type ReportItem = {
	id: string;
	reporter_id: string;
	target_id: string;
	booking_id: string | null;
	reason: string;
	status: ReportStatus;
	admin_note: string | null;
	created_at: string;
	reporterName: string;
	targetName: string;
	targetIsPartner: boolean;
};
