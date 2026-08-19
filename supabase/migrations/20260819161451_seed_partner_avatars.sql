-- supabase/migrations/20260819161451_seed_partner_avatars.sql
-- 개발용 시드 파트너 6명에게 일러스트 아바타(public/partners/*.svg) 연결.
-- 실제 파트너의 photo_urls(Supabase Storage URL)는 건드리지 않는다.

update public.partner_profiles as p
set photo_urls = array[x.url]
from (
	values
		('11111111-1111-4111-8111-111111111101'::uuid, '/partners/imgPartnerSeoyeon.svg'),
		('11111111-1111-4111-8111-111111111102'::uuid, '/partners/imgPartnerJiwoo.svg'),
		('11111111-1111-4111-8111-111111111103'::uuid, '/partners/imgPartnerHayoon.svg'),
		('11111111-1111-4111-8111-111111111104'::uuid, '/partners/imgPartnerDaeun.svg'),
		('11111111-1111-4111-8111-111111111105'::uuid, '/partners/imgPartnerSumin.svg'),
		('11111111-1111-4111-8111-111111111106'::uuid, '/partners/imgPartnerYerin.svg')
) as x(profile_id, url)
where p.profile_id = x.profile_id
	and p.photo_urls = '{}';
