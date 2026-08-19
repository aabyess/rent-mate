-- supabase/migrations/20260819153853_reviews_partner_visibility.sql
-- 파트너 상세에서 남의 후기가 안 보이는 문제 해결:
-- reviews 조회가 bookings RLS에 막히므로 partner_id를 비정규화하고 파트너 기준 조회 정책으로 교체한다.

alter table public.reviews
	add column partner_id uuid references public.profiles (id);

update public.reviews r
set partner_id = b.partner_id
from public.bookings b
where b.id = r.booking_id;

alter table public.reviews
	alter column partner_id set not null;

create index reviews_partner_id_idx on public.reviews (partner_id, created_at desc);

-- 조회: 로그인 사용자는 승인된 파트너의 후기를 파트너 기준으로 읽을 수 있다 (기존 정책 교체)
drop policy "reviews_select_authenticated" on public.reviews;
create policy "reviews_select_partner_public" on public.reviews
	for select using (
		auth.uid() is not null
		and (
			author_id = auth.uid()
			or partner_id = auth.uid()
			or exists (
				select 1 from public.partner_profiles pp
				where pp.profile_id = reviews.partner_id
					and pp.is_approved = true
			)
			or public.is_admin()
		)
	);

-- 작성: partner_id가 해당 예약의 실제 파트너와 일치해야 한다 (위조 방지, 기존 정책 교체)
drop policy "reviews_insert_booking_customer" on public.reviews;
create policy "reviews_insert_booking_customer" on public.reviews
	for insert with check (
		author_id = auth.uid()
		and exists (
			select 1 from public.bookings b
			where b.id = reviews.booking_id
				and b.customer_id = auth.uid()
				and b.partner_id = reviews.partner_id
				and b.status = 'completed'
		)
	);
