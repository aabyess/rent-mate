// features/auth/components/MyPageContent/index.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { Badge } from "@/components/ui/Badge";
import { MyPageContentMenuGroup } from "@/features/auth/components/MyPageContent/MyPageContentMenuGroup";
import { useSignOutMutation } from "@/features/auth/mutations";
import { useMyProfileQuery } from "@/features/auth/queries";
import { useMyBookingsQuery } from "@/features/bookings/queries";
import type { MyBookingItem } from "@/features/bookings/types";
import { formatBookingPeriod } from "@/features/bookings/utils";
import { useMyPartnerProfileQuery } from "@/features/partners/queries";

const NOW_MS = Date.now();
const DAY_MS = 24 * 60 * 60 * 1000;

const ROLE_LABELS: Record<string, string> = {
	customer: "고객",
	partner: "파트너",
	admin: "관리자",
};

function findUpcomingBooking(bookings: MyBookingItem[]): MyBookingItem | null {
	const upcoming = bookings
		.filter(function (booking) {
			return (
				new Date(booking.starts_at).getTime() > NOW_MS &&
				(booking.status === "requested" || booking.status === "accepted")
			);
		})
		.sort(function (a, b) {
			return new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime();
		});
	return upcoming[0] ?? null;
}

export function MyPageContent(): JSX.Element {
	const router = useRouter();
	const { data: profile, isPending } = useMyProfileQuery();
	const { data: bookings } = useMyBookingsQuery();
	const { data: myPartnerProfile } = useMyPartnerProfileQuery();
	const signOutMutation = useSignOutMutation();

	function handleSignOut(): void {
		signOutMutation.mutate(undefined, {
			onSuccess: function (): void {
				router.replace("/login");
				router.refresh();
			},
		});
	}

	if (isPending) {
		return (
			<div className="flex flex-col gap-3.5">
				<div className="bg-surface h-32 animate-pulse rounded-2xl" />
				<div className="bg-surface h-40 animate-pulse rounded-2xl" />
			</div>
		);
	}

	if (!profile) {
		return <p className="text-sub py-16 text-center text-sm">프로필을 불러오지 못했어요.</p>;
	}

	const joinedAt = new Date(profile.created_at);
	const upcomingBooking = bookings ? findUpcomingBooking(bookings) : null;
	const dDay = upcomingBooking
		? Math.ceil((new Date(upcomingBooking.starts_at).getTime() - NOW_MS) / DAY_MS)
		: 0;

	let partnerBannerTitle = "파트너로 활동하기";
	let partnerBannerDescription = "프로필 등록 후 관리자 승인을 거쳐요";
	if (myPartnerProfile && !myPartnerProfile.is_approved) {
		partnerBannerTitle = `승인 대기 중 · ${myPartnerProfile.nickname}`;
		partnerBannerDescription = "관리자 승인 후 프로필이 공개돼요";
	}
	if (myPartnerProfile && myPartnerProfile.is_approved) {
		partnerBannerTitle = `파트너 활동 중 · ${myPartnerProfile.nickname}`;
		partnerBannerDescription = "받은 예약 요청은 예약 탭에서 확인해요";
	}

	return (
		<div className="flex flex-col gap-3.5">
			<div className="bg-surface flex flex-col gap-3.5 rounded-2xl p-4.5">
				<div className="flex items-center gap-3.5">
					<div className="from-secondary-100 to-secondary-200 flex size-14 items-center justify-center rounded-full bg-gradient-to-br">
						<svg width="28" height="28" viewBox="0 0 24 24" fill="#2e9995" opacity="0.5">
							<circle cx="12" cy="8.5" r="3.6" />
							<path d="M4.5 21c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7z" />
						</svg>
					</div>
					<div className="flex flex-col gap-0.5">
						<span className="text-lg font-bold">{profile.name}</span>
						<span className="text-sub text-[13px]">
							{ROLE_LABELS[profile.role] ?? profile.role} · 가입 {joinedAt.getFullYear()}.{" "}
							{joinedAt.getMonth() + 1}
						</span>
					</div>
				</div>
				<div className="flex flex-wrap gap-2">
					{profile.adult_verified_at !== null && <Badge variant="trust">성인인증</Badge>}
					<Badge variant="trust">실명인증</Badge>
					{profile.phone_verified_at === null ? (
						<Badge variant="warning">휴대전화 인증하기</Badge>
					) : (
						<Badge variant="trust">휴대전화 인증</Badge>
					)}
				</div>
			</div>

			{upcomingBooking && (
				<Link
					href="/bookings"
					className="bg-brand-subtle flex items-center gap-3 rounded-2xl px-4.5 py-4">
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#dd5230"
						strokeWidth="1.8"
						strokeLinecap="round">
						<rect x="3" y="5" width="18" height="16" rx="3" />
						<path d="M3 10h18M8 3v4M16 3v4" />
					</svg>
					<div className="flex flex-col gap-0.5">
						<span className="text-primary-700 text-sm font-semibold">
							{upcomingBooking.counterpartName} 님과의 데이트 D-{dDay}
						</span>
						<span className="text-sub text-xs tabular-nums">
							{formatBookingPeriod(upcomingBooking.starts_at, upcomingBooking.ends_at)} ·{" "}
							{upcomingBooking.place}
						</span>
					</div>
					<svg
						className="text-primary-600 ml-auto shrink-0"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M9 5l7 7-7 7" />
					</svg>
				</Link>
			)}

			<MyPageContentMenuGroup
				items={[{ label: "결제 수단" }, { label: "후기 관리" }, { label: "차단 목록" }]}
			/>

			<MyPageContentMenuGroup
				title="안전"
				items={[
					{ label: "안전 센터" },
					{ label: "신고 내역" },
					{ label: "긴급 연락", labelClassName: "font-medium text-error-700" },
				]}
			/>

			<Link
				href={myPartnerProfile ? "/bookings" : "/partner/register"}
				className="bg-secondary-50 flex items-center gap-3 rounded-2xl px-4.5 py-4">
				<svg
					width="22"
					height="22"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#237c79"
					strokeWidth="1.8"
					strokeLinecap="round">
					<circle cx="12" cy="8" r="4" />
					<path d="M5 21c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />
				</svg>
				<div className="flex flex-col gap-0.5">
					<span className="text-secondary-700 text-sm font-semibold">{partnerBannerTitle}</span>
					<span className="text-sub text-xs">{partnerBannerDescription}</span>
				</div>
				<svg
					className="text-secondary-600 ml-auto shrink-0"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round">
					<path d="M9 5l7 7-7 7" />
				</svg>
			</Link>

			<MyPageContentMenuGroup items={[{ label: "고객센터" }, { label: "약관 및 정책" }]} />

			{profile.role === "admin" && (
				<Link
					href="/admin"
					className="bg-surface flex items-center justify-between rounded-2xl px-4.5 py-4">
					<span className="text-[15px] font-semibold">관리자 대시보드</span>
					<svg
						className="text-neutral-300"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M9 5l7 7-7 7" />
					</svg>
				</Link>
			)}

			<div className="flex items-center justify-center gap-4 py-1.5 text-[13px] text-neutral-400">
				<button type="button" onClick={handleSignOut} disabled={signOutMutation.isPending}>
					{signOutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
				</button>
				<span className="text-neutral-300">|</span>
				<span>회원 탈퇴</span>
			</div>
		</div>
	);
}
