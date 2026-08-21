// features/admin/apis.ts
import type {
	AdminMetrics,
	AdminPaymentItem,
	FlaggedMessageItem,
	PendingPartnerItem,
	ReportContext,
	ReportContextContent,
	ReportItem,
	ReportStatus,
} from "@/features/admin/types";
import type { BookingStatus } from "@/features/bookings/types";
import type { PaymentRow } from "@/features/payments/types";
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
		.select(
			"profile_id, nickname, bio, hourly_rate_krw, birth_year, interests, photo_urls, gender, region, purpose_tags, created_at",
		)
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
		.select("id, reporter_id, target_id, booking_id, reason, status, admin_note, created_at")
		.order("created_at", { ascending: false });
	if (error) {
		throw error;
	}
	const rows = (data ?? []) as Omit<
		ReportItem,
		"reporterName" | "targetName" | "targetIsPartner"
	>[];

	const targetIds = Array.from(
		new Set(
			rows.map(function (row) {
				return row.target_id;
			}),
		),
	);
	const [nameById, partnerIds] = await Promise.all([
		getNamesByProfileIds(
			rows.flatMap(function (row) {
				return [row.reporter_id, row.target_id];
			}),
		),
		getPartnerProfileIds(targetIds),
	]);
	return rows.map(function (row) {
		return {
			...row,
			reporterName: nameById.get(row.reporter_id) ?? "알 수 없음",
			targetName: nameById.get(row.target_id) ?? "알 수 없음",
			targetIsPartner: partnerIds.has(row.target_id),
		};
	});
}

async function getPartnerProfileIds(profileIds: string[]): Promise<Set<string>> {
	const supabase = createClient();
	if (profileIds.length === 0) {
		return new Set();
	}
	const { data, error } = await supabase
		.from("partner_profiles")
		.select("profile_id")
		.in("profile_id", profileIds);
	if (error) {
		throw error;
	}
	return new Set(
		((data ?? []) as { profile_id: string }[]).map(function (row) {
			return row.profile_id;
		}),
	);
}

export async function getReportContextContent(
	context: ReportContext,
): Promise<ReportContextContent> {
	const supabase = createClient();
	if (context.type === "review") {
		const { data, error } = await supabase
			.from("reviews")
			.select("content")
			.eq("id", context.id)
			.maybeSingle();
		if (error) {
			throw error;
		}
		return { content: data?.content ?? null, imagePath: null };
	}
	if (context.type === "chat_message") {
		const { data, error } = await supabase
			.from("chat_messages")
			.select("content, image_url")
			.eq("id", context.id)
			.maybeSingle();
		if (error) {
			throw error;
		}
		return { content: data?.content ?? null, imagePath: data?.image_url ?? null };
	}
	const { data, error } = await supabase
		.from("partner_posts")
		.select("content")
		.eq("id", context.id)
		.maybeSingle();
	if (error) {
		throw error;
	}
	return { content: data?.content ?? null, imagePath: null };
}

export async function patchPartnerDeactivation(profileId: string): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase
		.from("partner_profiles")
		.update({ is_active: false })
		.eq("profile_id", profileId);
	if (error) {
		throw error;
	}
}

export async function getFlaggedMessages(): Promise<FlaggedMessageItem[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("chat_messages")
		.select("id, booking_id, sender_id, content, created_at")
		.eq("flagged", true)
		.order("created_at", { ascending: false })
		.limit(50);
	if (error) {
		throw error;
	}
	const rows = (data ?? []) as Omit<FlaggedMessageItem, "senderName">[];

	const nameById = await getNamesByProfileIds(
		rows.map(function (row) {
			return row.sender_id;
		}),
	);
	return rows.map(function (row) {
		return { ...row, senderName: nameById.get(row.sender_id) ?? "알 수 없음" };
	});
}

export async function getPaymentsOverview(): Promise<AdminPaymentItem[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("payments")
		.select(
			"id, booking_id, customer_id, amount_krw, status, provider, provider_payment_key, approved_at, created_at, refunded_amount_krw, cancellation_fee_krw, payout_amount_krw, payout_fee_krw, released_at",
		)
		.order("created_at", { ascending: false })
		.limit(50);
	if (error) {
		throw error;
	}
	const payments = (data ?? []) as PaymentRow[];
	if (payments.length === 0) {
		return [];
	}

	const { data: bookings, error: bookingsError } = await supabase
		.from("bookings")
		.select("id, status")
		.in(
			"id",
			payments.map(function (payment) {
				return payment.booking_id;
			}),
		);
	if (bookingsError) {
		throw bookingsError;
	}
	const bookingStatusById = new Map(
		((bookings ?? []) as { id: string; status: BookingStatus }[]).map(function (booking) {
			return [booking.id, booking.status] as const;
		}),
	);
	const nameById = await getNamesByProfileIds(
		payments.map(function (payment) {
			return payment.customer_id;
		}),
	);

	return payments.map(function (payment) {
		const bookingStatus = bookingStatusById.get(payment.booking_id) ?? "requested";
		return {
			...payment,
			bookingStatus,
			customerName: nameById.get(payment.customer_id) ?? "알 수 없음",
			needsRefund:
				payment.status === "paid" && (bookingStatus === "canceled" || bookingStatus === "rejected"),
			canRelease: payment.status === "paid" && bookingStatus === "completed",
		};
	});
}

export async function patchPaymentStatus(paymentId: string, status: "refunded"): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase.rpc("update_payment_status", {
		p_payment_id: paymentId,
		p_status: status,
	});
	if (error) {
		throw error;
	}
}

export async function postCompletePartnerSettlement(
	paymentId: string,
): Promise<{ payoutAmountKrw: number; payoutFeeKrw: number }> {
	const supabase = createClient();
	const { data, error } = await supabase.rpc("complete_partner_settlement", {
		p_payment_id: paymentId,
	});
	if (error) {
		throw error;
	}
	const row = (data as { payout_amount_krw: number; payout_fee_krw: number }[])[0];
	return { payoutAmountKrw: row?.payout_amount_krw ?? 0, payoutFeeKrw: row?.payout_fee_krw ?? 0 };
}

export async function patchReportStatus(
	reportId: string,
	status: ReportStatus,
	adminNote: string,
): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase
		.from("reports")
		.update({ status, admin_note: adminNote || null })
		.eq("id", reportId);
	if (error) {
		throw error;
	}
}

// "오늘"은 KST 기준 자정이어야 하지만, 관리자는 항상 한국에서 접속한다는 전제로
// v1은 브라우저 로컬 자정으로 계산한다 (클라이언트 로컬 = KST 자정).
function getStartOfTodayIso(): string {
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
}

// 긴급 큐 카드의 "최장 N일" 배지용 — 가장 오래된 미처리 항목의 생성일
async function getOldestCreatedAt(
	query: PromiseLike<{ data: { created_at: string }[] | null; error: { message: string } | null }>,
): Promise<string | null> {
	const { data, error } = await query;
	if (error) {
		throw error;
	}
	return data?.[0]?.created_at ?? null;
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
	const supabase = createClient();
	const startOfTodayIso = getStartOfTodayIso();

	const [
		pendingPartners,
		openReports,
		flaggedMessages,
		safetyFlaggedReviews,
		activePartners,
		todaySignups,
		todayBookings,
		pendingPartnerOldestAt,
		openReportOldestAt,
		flaggedMessageOldestAt,
		safetyFlaggedReviewOldestAt,
	] = await Promise.all([
		supabase
			.from("partner_profiles")
			.select("profile_id", { count: "exact", head: true })
			.eq("is_approved", false),
		supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "open"),
		supabase.from("chat_messages").select("id", { count: "exact", head: true }).eq("flagged", true),
		supabase
			.from("reviews")
			.select("id", { count: "exact", head: true })
			.eq("safety_flagged", true),
		supabase
			.from("partner_profiles")
			.select("profile_id", { count: "exact", head: true })
			.eq("is_approved", true)
			.eq("is_active", true),
		supabase
			.from("profiles")
			.select("id", { count: "exact", head: true })
			.gte("created_at", startOfTodayIso),
		supabase
			.from("bookings")
			.select("id", { count: "exact", head: true })
			.gte("created_at", startOfTodayIso),
		getOldestCreatedAt(
			supabase
				.from("partner_profiles")
				.select("created_at")
				.eq("is_approved", false)
				.order("created_at", { ascending: true })
				.limit(1),
		),
		getOldestCreatedAt(
			supabase
				.from("reports")
				.select("created_at")
				.eq("status", "open")
				.order("created_at", { ascending: true })
				.limit(1),
		),
		getOldestCreatedAt(
			supabase
				.from("chat_messages")
				.select("created_at")
				.eq("flagged", true)
				.order("created_at", { ascending: true })
				.limit(1),
		),
		getOldestCreatedAt(
			supabase
				.from("reviews")
				.select("created_at")
				.eq("safety_flagged", true)
				.order("created_at", { ascending: true })
				.limit(1),
		),
	]);

	for (const result of [
		pendingPartners,
		openReports,
		flaggedMessages,
		safetyFlaggedReviews,
		activePartners,
		todaySignups,
		todayBookings,
	]) {
		if (result.error) {
			throw result.error;
		}
	}

	return {
		pendingPartnerCount: pendingPartners.count ?? 0,
		pendingPartnerOldestAt,
		openReportCount: openReports.count ?? 0,
		openReportOldestAt,
		flaggedMessageCount: flaggedMessages.count ?? 0,
		flaggedMessageOldestAt,
		safetyFlaggedReviewCount: safetyFlaggedReviews.count ?? 0,
		safetyFlaggedReviewOldestAt,
		activePartnerCount: activePartners.count ?? 0,
		todaySignupCount: todaySignups.count ?? 0,
		todayBookingCount: todayBookings.count ?? 0,
	};
}
