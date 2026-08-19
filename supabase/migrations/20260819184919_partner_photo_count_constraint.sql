-- supabase/migrations/20260819184919_partner_photo_count_constraint.sql
-- 파트너 사진은 3~9장을 갖추도록 강제한다 (탐색 신뢰도 기준). 기존 시드 6명
-- (…101~106)은 사진 1장뿐이라 3장으로 먼저 백필한 뒤 제약을 건다 — 순서를
-- 바꾸면 백필 전 기존 행이 제약에 걸려 마이그레이션 자체가 실패한다.
-- ⚠️ 데모 전용 스톡 사진(초상권 리스크, 20260819170228/184651과 동일 경고).
-- 사전 확인: 시드 외 실사용자 파트너 프로필 중 사진 3장 미만인 행 없음
-- (select count(*) from partner_profiles where array_length(photo_urls,1) is null
--  or array_length(photo_urls,1) < 3 → 시드 6명만 해당, 실사용자 위반 없음).

update public.partner_profiles set photo_urls = array[
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-101-1.jpg',
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-101-2.jpg',
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-101-3.jpg'
] where profile_id = '11111111-1111-4111-8111-111111111101';

update public.partner_profiles set photo_urls = array[
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-102-1.jpg',
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-102-2.jpg',
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-102-3.jpg'
] where profile_id = '11111111-1111-4111-8111-111111111102';

update public.partner_profiles set photo_urls = array[
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-103-1.jpg',
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-103-2.jpg',
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-103-3.jpg'
] where profile_id = '11111111-1111-4111-8111-111111111103';

update public.partner_profiles set photo_urls = array[
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-104-1.jpg',
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-104-2.jpg',
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-104-3.jpg'
] where profile_id = '11111111-1111-4111-8111-111111111104';

update public.partner_profiles set photo_urls = array[
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-105-1.jpg',
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-105-2.jpg',
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-105-3.jpg'
] where profile_id = '11111111-1111-4111-8111-111111111105';

update public.partner_profiles set photo_urls = array[
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-106-1.jpg',
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-106-2.jpg',
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-106-3.jpg'
] where profile_id = '11111111-1111-4111-8111-111111111106';

alter table public.partner_profiles
	add constraint partner_profiles_photo_count check (array_length(photo_urls, 1) between 3 and 9);
