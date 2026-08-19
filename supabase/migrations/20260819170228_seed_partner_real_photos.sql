-- supabase/migrations/20260819170228_seed_partner_real_photos.sql
-- 시드 파트너 6명의 일러스트 아바타를 고화질 실사진(partner-photos 버킷 seed/, 사전 업로드 완료)으로 교체.
-- ⚠️ Unsplash 스톡 인물 사진: 데모 전용. 실존 인물을 동행 파트너로 표기하는 것은 초상권 리스크가
-- 있으므로 정식 오픈 전 실제 파트너 사진으로 반드시 교체할 것.

update public.partner_profiles set photo_urls = array[
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-101.jpg'
] where profile_id = '11111111-1111-4111-8111-111111111101';

update public.partner_profiles set photo_urls = array[
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-102.jpg'
] where profile_id = '11111111-1111-4111-8111-111111111102';

update public.partner_profiles set photo_urls = array[
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-103.jpg'
] where profile_id = '11111111-1111-4111-8111-111111111103';

update public.partner_profiles set photo_urls = array[
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-104.jpg'
] where profile_id = '11111111-1111-4111-8111-111111111104';

update public.partner_profiles set photo_urls = array[
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-105.jpg'
] where profile_id = '11111111-1111-4111-8111-111111111105';

update public.partner_profiles set photo_urls = array[
	'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-106.jpg'
] where profile_id = '11111111-1111-4111-8111-111111111106';

