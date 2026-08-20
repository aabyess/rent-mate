-- supabase/migrations/20260820150000_partner_counterpart_visibility.sql
-- 탈퇴(또는 비활성) 파트너의 partner_profiles 행은 기존 select 정책상 본인·admin 외에는
-- 아무도 못 보게 된다. 그러면 탈퇴 익명화로 바꿔둔 '탈퇴한 파트너' 닉네임을 예약 이력이
-- 있는 고객조차 볼 수 없어 상대 표시가 "알 수 없음"으로 떨어진다 (#68 리뷰에서 발견).
-- profiles에 이미 있는 booking-counterpart 정책과 동일한 패턴으로 보완한다:
-- 나(고객)와 예약이 존재하는 파트너의 행은 활성 여부와 무관하게 조회 가능.

create policy "partner_profiles_select_booking_counterpart" on public.partner_profiles
	for select using (
		exists (
			select 1 from public.bookings b
			where b.partner_id = partner_profiles.profile_id
				and b.customer_id = auth.uid()
		)
	);
