-- supabase/migrations/20260821190000_profile_private.sql
-- 고객 거주 권역 (프라이버시 헌장: 정확한 좌표·주소는 저장하지 않고 권역 단위로만 저장한다).
-- constants/regions.ts REGIONS와 값 동기화 필요. 파트너 활동 지역은 기존 partner_profiles.region 사용.
--
-- profiles 테이블에는 못 넣는다 — profiles_select_booking_counterpart 정책 때문에 예약이
-- 성립된 상대는 profiles 행 전체를 읽을 수 있어(RLS는 행 단위, 컬럼을 못 가림), 컬럼을 얹으면
-- 파트너에게 고객 거주 권역이 그대로 노출된다(프라이버시 헌장 ③ 위반). 그래서 본인·관리자만
-- 접근 가능한 별도 테이블로 분리한다 — counterpart 조회 정책은 이 테이블에 절대 만들지 않는다.
-- 행 부재 = 미설정으로 취급(기본값 없음).

create table public.profile_private (
	profile_id uuid primary key references public.profiles (id) on delete cascade,
	home_region text
);

alter table public.profile_private enable row level security;

create policy "profile_private_select_own_or_admin" on public.profile_private
	for select using (profile_id = auth.uid() or public.is_admin());
create policy "profile_private_insert_own" on public.profile_private
	for insert with check (profile_id = auth.uid());
create policy "profile_private_update_own" on public.profile_private
	for update using (profile_id = auth.uid());
