-- supabase/migrations/20260819170000_partner_available_weekdays.sql
-- 파트너 가능 요일 (0=일 ~ 6=토). 예약 캘린더에서 불가 요일은 비활성화된다.

alter table public.partner_profiles
	add column available_weekdays smallint[] not null default '{0,1,2,3,4,5,6}';

-- 시드 파트너에 다양한 가능 요일 부여
update public.partner_profiles set available_weekdays = '{2,4,5,6}'
	where profile_id = '11111111-1111-4111-8111-111111111101';
update public.partner_profiles set available_weekdays = '{0,6}'
	where profile_id = '11111111-1111-4111-8111-111111111102';
update public.partner_profiles set available_weekdays = '{1,2,3,4,5}'
	where profile_id = '11111111-1111-4111-8111-111111111103';
update public.partner_profiles set available_weekdays = '{3,5,6}'
	where profile_id = '11111111-1111-4111-8111-111111111104';
update public.partner_profiles set available_weekdays = '{0,2,4}'
	where profile_id = '11111111-1111-4111-8111-111111111105';
