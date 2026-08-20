-- supabase/migrations/20260820191000_partner_posts_counterpart_visibility.sql
-- #79 리뷰 반영: partner_profiles의 booking-counterpart 예외(#68)를 partner_posts에도
-- 미러링 — 예약 이력이 있는 고객은 파트너가 비활성화돼도 소식을 계속 볼 수 있다.

drop policy "partner_posts_select" on public.partner_posts;

create policy "partner_posts_select" on public.partner_posts
	for select using (
		(
			auth.uid() is not null
			and exists (
				select 1 from public.partner_profiles pp
				where pp.profile_id = partner_posts.partner_id
					and pp.is_approved
					and pp.is_active
			)
		)
		or partner_id = auth.uid()
		or exists (
			select 1 from public.bookings b
			where b.partner_id = partner_posts.partner_id
				and b.customer_id = auth.uid()
		)
		or public.is_admin()
	);
