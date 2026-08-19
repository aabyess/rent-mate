-- supabase/migrations/20260819000003_dev_seed_partners.sql
-- 개발용 시드 파트너 6명. 로그인 불가 더미 계정 (FK 충족용 auth.users 행 포함).
-- on conflict do nothing이라 재실행해도 안전하다.

insert into auth.users (
	instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
	raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
select
	'00000000-0000-0000-0000-000000000000', x.id, 'authenticated', 'authenticated',
	x.email, 'seed-account-not-loginable', now(),
	'{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now()
from (
	values
		('11111111-1111-4111-8111-111111111101'::uuid, 'partner1@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111102'::uuid, 'partner2@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111103'::uuid, 'partner3@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111104'::uuid, 'partner4@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111105'::uuid, 'partner5@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111106'::uuid, 'partner6@seed.rentmate.local')
) as x(id, email)
on conflict (id) do nothing;

insert into public.profiles (id, role, name, phone_verified_at, adult_verified_at)
select x.id, 'partner', x.name, now(), now()
from (
	values
		('11111111-1111-4111-8111-111111111101'::uuid, '김서연'),
		('11111111-1111-4111-8111-111111111102'::uuid, '박지우'),
		('11111111-1111-4111-8111-111111111103'::uuid, '이하윤'),
		('11111111-1111-4111-8111-111111111104'::uuid, '최다은'),
		('11111111-1111-4111-8111-111111111105'::uuid, '정수민'),
		('11111111-1111-4111-8111-111111111106'::uuid, '한예린')
) as x(id, name)
on conflict (id) do nothing;

insert into public.partner_profiles
	(profile_id, nickname, bio, hourly_rate_krw, birth_year, interests, is_approved, is_active)
select x.profile_id, x.nickname, x.bio, x.rate, x.birth_year, x.interests, true, true
from (
	values
		('11111111-1111-4111-8111-111111111101'::uuid, '서연', '전시 보러 다니는 걸 좋아해요. 조용한 카페에서 수다 떠는 시간도 좋아합니다.', 30000, 2000, array['전시 관람', '카페 투어']),
		('11111111-1111-4111-8111-111111111102'::uuid, '지우', '맛집 리스트 공유해요! 같이 걸으면서 동네 구경하는 걸 좋아합니다.', 28000, 2002, array['맛집 탐방', '산책']),
		('11111111-1111-4111-8111-111111111103'::uuid, '하윤', '보드게임 카페 단골이에요. 브런치 맛집도 잘 알아요.', 32000, 1998, array['보드게임', '브런치']),
		('11111111-1111-4111-8111-111111111104'::uuid, '다은', '영화 이야기 나누는 걸 좋아해요. 서점 데이트 환영입니다.', 30000, 2001, array['영화', '서점 데이트']),
		('11111111-1111-4111-8111-111111111105'::uuid, '수민', '미술관과 공원 산책 코스를 잘 짜요. 사진 찍는 것도 좋아합니다.', 35000, 1999, array['미술관', '사진 산책']),
		('11111111-1111-4111-8111-111111111106'::uuid, '예린', '커피를 정말 좋아해서 원두 이야기로 밤샐 수 있어요.', 27000, 2003, array['커피', '디저트 투어'])
) as x(profile_id, nickname, bio, rate, birth_year, interests)
on conflict (profile_id) do nothing;
