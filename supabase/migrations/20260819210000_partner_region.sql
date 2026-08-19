-- supabase/migrations/20260819210000_partner_region.sql
-- 파트너 활동 지역 (v1: 서울 권역만). constants/regions.ts의 REGIONS와 값 동기화 필요.

alter table public.partner_profiles
	add column region text not null default '기타';

update public.partner_profiles set region = '성수·성동'
	where profile_id = '11111111-1111-4111-8111-111111111101';
update public.partner_profiles set region = '홍대·마포'
	where profile_id = '11111111-1111-4111-8111-111111111102';
update public.partner_profiles set region = '강남·서초'
	where profile_id = '11111111-1111-4111-8111-111111111103';
update public.partner_profiles set region = '잠실·송파'
	where profile_id = '11111111-1111-4111-8111-111111111104';
update public.partner_profiles set region = '종로·중구'
	where profile_id = '11111111-1111-4111-8111-111111111105';
update public.partner_profiles set region = '여의도·영등포'
	where profile_id = '11111111-1111-4111-8111-111111111106';
