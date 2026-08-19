-- supabase/migrations/20260819000004_partner_mode.sql
-- 예약 당사자끼리는 서로의 프로필(이름)을 조회할 수 있어야 한다 (채팅·예약 목록 표시용)

create policy "profiles_select_booking_counterpart" on public.profiles
	for select using (
		exists (
			select 1 from public.bookings b
			where
				(b.customer_id = auth.uid() and b.partner_id = profiles.id)
				or (b.partner_id = auth.uid() and b.customer_id = profiles.id)
		)
	);
