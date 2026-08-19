-- supabase/migrations/20260819000002_partner_display_fields.sql
-- 파트너 카드 노출용 필드: 나이 표기용 출생연도, 관심사 태그

alter table public.partner_profiles
	add column birth_year integer check (birth_year between 1900 and 2100),
	add column interests text[] not null default '{}';
