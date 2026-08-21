-- supabase/migrations/20260821123000_inquiries_insert_guard.sql
-- #111 리뷰 반영: insert with check가 profile_id만 검사해서 고객이 status='answered'
-- + 가짜 answer로 접수할 수 있었다(관리자가 미답변 문의를 놓치는 운영 리스크).
-- 접수 시점엔 반드시 미답변 상태여야 한다.

drop policy "inquiries_insert_own" on public.inquiries;

create policy "inquiries_insert_own" on public.inquiries
	for insert with check (
		profile_id = auth.uid()
		and status = 'open'
		and answer is null
		and answered_at is null
	);
