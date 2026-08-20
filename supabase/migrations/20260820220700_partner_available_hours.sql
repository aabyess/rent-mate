-- supabase/migrations/20260820220700_partner_available_hours.sql
-- 파트너 가능 시간대(전역 1개, 요일별 상이 시간대는 v2). default가 기존 행을 자동
-- 백필하므로 별도 update 불요(available_weekdays와 동일 패턴).

alter table public.partner_profiles
	add column available_start_hour integer not null default 10 check (available_start_hour between 0 and 24),
	add column available_end_hour integer not null default 22 check (available_end_hour between 0 and 24);

alter table public.partner_profiles
	add constraint partner_profiles_available_hour_range check (available_start_hour < available_end_hour);
