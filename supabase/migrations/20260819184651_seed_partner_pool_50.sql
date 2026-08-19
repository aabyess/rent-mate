-- supabase/migrations/20260819184651_seed_partner_pool_50.sql
-- 데모용 시드 파트너 50명 추가 (20260819000003 패턴 확장, 로그인 불가 더미 계정).
-- ⚠️ 데모 전용: 사진은 20260819170228과 동일하게 사전 업로드된 스톡 인물 사진(초상권 리스크,
-- 정식 오픈 전 실제 파트너 사진으로 교체 필수). 이름·소개는 전부 가상 인물이다.
--
-- 참고: 20260819165515에서 추가한 profiles_enforce_customer_role 트리거가 모든
-- INSERT에서 role을 customer로 강제하므로(회원가입 권한 상승 방지), 기존 6명 시드와
-- 동일하게 role='partner'로 남기려면 이 insert 구간만 잠시 해제해야 한다. 실제 파트너
-- 가입 플로우는 애초에 profiles.role을 건드리지 않으므로(파트너 여부는 partner_profiles
-- 행 존재로 판단) 기능상 영향은 없고, 순수히 기존 시드 데이터와의 표기 일관성 목적이다.

alter table public.profiles disable trigger profiles_enforce_customer_role;

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
		('11111111-1111-4111-8111-111111111201'::uuid, 'partner012@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111202'::uuid, 'partner022@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111203'::uuid, 'partner032@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111204'::uuid, 'partner042@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111205'::uuid, 'partner052@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111206'::uuid, 'partner062@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111207'::uuid, 'partner072@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111208'::uuid, 'partner082@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111209'::uuid, 'partner092@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111210'::uuid, 'partner102@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111211'::uuid, 'partner112@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111212'::uuid, 'partner122@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111213'::uuid, 'partner132@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111214'::uuid, 'partner142@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111215'::uuid, 'partner152@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111216'::uuid, 'partner162@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111217'::uuid, 'partner172@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111218'::uuid, 'partner182@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111219'::uuid, 'partner192@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111220'::uuid, 'partner202@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111221'::uuid, 'partner212@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111222'::uuid, 'partner222@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111223'::uuid, 'partner232@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111224'::uuid, 'partner242@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111225'::uuid, 'partner252@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111226'::uuid, 'partner262@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111227'::uuid, 'partner272@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111228'::uuid, 'partner282@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111229'::uuid, 'partner292@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111230'::uuid, 'partner302@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111231'::uuid, 'partner312@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111232'::uuid, 'partner322@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111233'::uuid, 'partner332@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111234'::uuid, 'partner342@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111235'::uuid, 'partner352@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111236'::uuid, 'partner362@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111237'::uuid, 'partner372@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111238'::uuid, 'partner382@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111239'::uuid, 'partner392@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111240'::uuid, 'partner402@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111241'::uuid, 'partner412@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111242'::uuid, 'partner422@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111243'::uuid, 'partner432@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111244'::uuid, 'partner442@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111245'::uuid, 'partner452@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111246'::uuid, 'partner462@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111247'::uuid, 'partner472@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111248'::uuid, 'partner482@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111249'::uuid, 'partner492@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111250'::uuid, 'partner502@seed.rentmate.local')
) as x(id, email)
on conflict (id) do nothing;

-- enforce_adult_verification 트리거가 birth_date를 필수로 요구하므로 함께 지정한다
-- (adult_verified_at은 그 트리거가 now()로 자동 세팅하므로 여기 값은 덮어써짐).
insert into public.profiles (id, role, name, birth_date, phone_verified_at, adult_verified_at)
select x.id, 'partner', x.name, x.birth_date, now(), now()
from (
	values
		('11111111-1111-4111-8111-111111111201'::uuid, '김아린', date '1997-01-01'),
		('11111111-1111-4111-8111-111111111202'::uuid, '이다인', date '1998-01-01'),
		('11111111-1111-4111-8111-111111111203'::uuid, '박유나', date '1999-01-01'),
		('11111111-1111-4111-8111-111111111204'::uuid, '최소율', date '2000-01-01'),
		('11111111-1111-4111-8111-111111111205'::uuid, '정나윤', date '2001-01-01'),
		('11111111-1111-4111-8111-111111111206'::uuid, '강채원', date '2002-01-01'),
		('11111111-1111-4111-8111-111111111207'::uuid, '조지민', date '2003-01-01'),
		('11111111-1111-4111-8111-111111111208'::uuid, '윤하은', date '2004-01-01'),
		('11111111-1111-4111-8111-111111111209'::uuid, '장서윤', date '1996-01-01'),
		('11111111-1111-4111-8111-111111111210'::uuid, '임유진', date '1997-01-01'),
		('11111111-1111-4111-8111-111111111211'::uuid, '한민서', date '1998-01-01'),
		('11111111-1111-4111-8111-111111111212'::uuid, '오예은', date '1999-01-01'),
		('11111111-1111-4111-8111-111111111213'::uuid, '서시은', date '2000-01-01'),
		('11111111-1111-4111-8111-111111111214'::uuid, '신채은', date '2001-01-01'),
		('11111111-1111-4111-8111-111111111215'::uuid, '권하린', date '2002-01-01'),
		('11111111-1111-4111-8111-111111111216'::uuid, '황소민', date '2003-01-01'),
		('11111111-1111-4111-8111-111111111217'::uuid, '안지안', date '2004-01-01'),
		('11111111-1111-4111-8111-111111111218'::uuid, '송아윤', date '1996-01-01'),
		('11111111-1111-4111-8111-111111111219'::uuid, '류다연', date '1997-01-01'),
		('11111111-1111-4111-8111-111111111220'::uuid, '전수아', date '1998-01-01'),
		('11111111-1111-4111-8111-111111111221'::uuid, '김예나', date '1999-01-01'),
		('11111111-1111-4111-8111-111111111222'::uuid, '이소연', date '2000-01-01'),
		('11111111-1111-4111-8111-111111111223'::uuid, '박지원', date '2001-01-01'),
		('11111111-1111-4111-8111-111111111224'::uuid, '최나은', date '2002-01-01'),
		('11111111-1111-4111-8111-111111111225'::uuid, '정유빈', date '2003-01-01'),
		('11111111-1111-4111-8111-111111111226'::uuid, '강채린', date '2004-01-01'),
		('11111111-1111-4111-8111-111111111227'::uuid, '조은서', date '1996-01-01'),
		('11111111-1111-4111-8111-111111111228'::uuid, '윤하율', date '1997-01-01'),
		('11111111-1111-4111-8111-111111111229'::uuid, '장서아', date '1998-01-01'),
		('11111111-1111-4111-8111-111111111230'::uuid, '임지유', date '1999-01-01'),
		('11111111-1111-4111-8111-111111111231'::uuid, '한유민', date '2000-01-01'),
		('11111111-1111-4111-8111-111111111232'::uuid, '오서율', date '2001-01-01'),
		('11111111-1111-4111-8111-111111111233'::uuid, '서하영', date '2002-01-01'),
		('11111111-1111-4111-8111-111111111234'::uuid, '신소은', date '2003-01-01'),
		('11111111-1111-4111-8111-111111111235'::uuid, '권다현', date '2004-01-01'),
		('11111111-1111-4111-8111-111111111236'::uuid, '황채민', date '1996-01-01'),
		('11111111-1111-4111-8111-111111111237'::uuid, '안지수', date '1997-01-01'),
		('11111111-1111-4111-8111-111111111238'::uuid, '송유리', date '1998-01-01'),
		('11111111-1111-4111-8111-111111111239'::uuid, '류하나', date '1999-01-01'),
		('11111111-1111-4111-8111-111111111240'::uuid, '전서진', date '2000-01-01'),
		('11111111-1111-4111-8111-111111111241'::uuid, '김소영', date '2001-01-01'),
		('11111111-1111-4111-8111-111111111242'::uuid, '이나연', date '2002-01-01'),
		('11111111-1111-4111-8111-111111111243'::uuid, '박다희', date '2003-01-01'),
		('11111111-1111-4111-8111-111111111244'::uuid, '최채아', date '2004-01-01'),
		('11111111-1111-4111-8111-111111111245'::uuid, '정지은', date '1996-01-01'),
		('11111111-1111-4111-8111-111111111246'::uuid, '강규리', date '1997-01-01'),
		('11111111-1111-4111-8111-111111111247'::uuid, '조소원', date '1998-01-01'),
		('11111111-1111-4111-8111-111111111248'::uuid, '윤다솔', date '1999-01-01'),
		('11111111-1111-4111-8111-111111111249'::uuid, '장지현', date '2000-01-01'),
		('11111111-1111-4111-8111-111111111250'::uuid, '임서현', date '2001-01-01')
) as x(id, name, birth_date)
on conflict (id) do nothing;

alter table public.profiles enable trigger profiles_enforce_customer_role;

insert into public.partner_profiles
	(profile_id, nickname, bio, hourly_rate_krw, birth_year, interests, available_weekdays, region, photo_urls, is_approved, is_active)
select x.profile_id, x.nickname, x.bio, x.rate, x.birth_year, x.interests, x.weekdays, x.region, x.photo_urls, true, true
from (
	values
		('11111111-1111-4111-8111-111111111201'::uuid, '아린', '예쁜 카페 찾아다니는 걸 좋아해요. 숨은 맛집 찾아다니는 게 취미예요. 편하게 대화 나눠요.', 41000, 1997, array['카페 투어', '맛집 탐방', '사진'], array[0, 6]::smallint[], '강남·서초', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-201-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-201-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-201-3.jpg']),
		('11111111-1111-4111-8111-111111111202'::uuid, '다인', '숨은 맛집 찾아다니는 게 취미예요. 사진 찍는 걸 좋아해요. 즐거운 시간 함께해요.', 36000, 1998, array['맛집 탐방', '사진'], array[1, 2, 3, 4, 5]::smallint[], '홍대·마포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-202-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-202-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-202-3.jpg']),
		('11111111-1111-4111-8111-111111111203'::uuid, '유나', '사진 찍는 걸 좋아해요. 디저트 맛집 탐방을 즐겨요. 새로운 곳 같이 가봐요.', 31000, 1999, array['사진', '디저트 투어'], array[0, 1, 2, 3, 4, 5, 6]::smallint[], '성수·성동', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-203-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-203-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-203-3.jpg']),
		('11111111-1111-4111-8111-111111111204'::uuid, '소율', '디저트 맛집 탐방을 즐겨요. 한강이나 공원 산책을 즐겨요. 가볍게 만나요.', 26000, 2000, array['디저트 투어', '산책', '보드게임'], array[1, 2, 3, 4, 5, 6]::smallint[], '잠실·송파', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-204-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-204-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-204-3.jpg']),
		('11111111-1111-4111-8111-111111111205'::uuid, '나윤', '한강이나 공원 산책을 즐겨요. 보드게임 카페 단골이에요. 좋은 얘기 많이 나눠요.', 45000, 2001, array['산책', '보드게임'], array[5, 6, 0]::smallint[], '여의도·영등포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-205-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-205-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-205-3.jpg']),
		('11111111-1111-4111-8111-111111111206'::uuid, '채원', '보드게임 카페 단골이에요. 여유로운 브런치를 좋아해요. 여유롭게 시간 보내요.', 40000, 2002, array['보드게임', '브런치'], array[2, 4, 6]::smallint[], '종로·중구', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-206-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-206-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-206-3.jpg']),
		('11111111-1111-4111-8111-111111111207'::uuid, '지민', '여유로운 브런치를 좋아해요. 전시 보러 다니는 걸 좋아해요. 웃으면서 얘기해요.', 35000, 2003, array['브런치', '전시 관람', '영화'], array[1, 3, 5]::smallint[], '기타', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-207-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-207-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-207-3.jpg']),
		('11111111-1111-4111-8111-111111111208'::uuid, '하은', '전시 보러 다니는 걸 좋아해요. 영화 이야기 나누는 걸 좋아해요. 편안한 분위기 좋아해요.', 30000, 2004, array['전시 관람', '영화'], array[0, 6]::smallint[], '강남·서초', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-208-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-208-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-208-3.jpg']),
		('11111111-1111-4111-8111-111111111209'::uuid, '서윤', '영화 이야기 나누는 걸 좋아해요. 서점에서 책 구경하는 시간을 좋아해요. 즐겁게 얘기 나눠요.', 25000, 1996, array['영화', '서점 데이트'], array[1, 2, 3, 4, 5]::smallint[], '홍대·마포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-209-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-209-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-209-3.jpg']),
		('11111111-1111-4111-8111-111111111210'::uuid, '유진', '서점에서 책 구경하는 시간을 좋아해요. 예쁜 카페 찾아다니는 걸 좋아해요. 소소한 얘기 좋아해요.', 44000, 1997, array['서점 데이트', '카페 투어', '맛집 탐방'], array[0, 1, 2, 3, 4, 5, 6]::smallint[], '성수·성동', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-210-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-210-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-210-3.jpg']),
		('11111111-1111-4111-8111-111111111211'::uuid, '민서', '예쁜 카페 찾아다니는 걸 좋아해요. 숨은 맛집 찾아다니는 게 취미예요. 편하게 대화 나눠요.', 39000, 1998, array['카페 투어', '맛집 탐방'], array[1, 2, 3, 4, 5, 6]::smallint[], '잠실·송파', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-211-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-211-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-211-3.jpg']),
		('11111111-1111-4111-8111-111111111212'::uuid, '예은', '숨은 맛집 찾아다니는 게 취미예요. 사진 찍는 걸 좋아해요. 즐거운 시간 함께해요.', 34000, 1999, array['맛집 탐방', '사진'], array[5, 6, 0]::smallint[], '여의도·영등포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-212-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-212-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-212-3.jpg']),
		('11111111-1111-4111-8111-111111111213'::uuid, '시은', '사진 찍는 걸 좋아해요. 디저트 맛집 탐방을 즐겨요. 새로운 곳 같이 가봐요.', 29000, 2000, array['사진', '디저트 투어', '산책'], array[2, 4, 6]::smallint[], '종로·중구', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-213-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-213-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-213-3.jpg']),
		('11111111-1111-4111-8111-111111111214'::uuid, '채은', '디저트 맛집 탐방을 즐겨요. 한강이나 공원 산책을 즐겨요. 가볍게 만나요.', 24000, 2001, array['디저트 투어', '산책'], array[1, 3, 5]::smallint[], '기타', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-214-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-214-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-214-3.jpg']),
		('11111111-1111-4111-8111-111111111215'::uuid, '하린', '한강이나 공원 산책을 즐겨요. 보드게임 카페 단골이에요. 좋은 얘기 많이 나눠요.', 43000, 2002, array['산책', '보드게임'], array[0, 6]::smallint[], '강남·서초', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-215-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-215-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-215-3.jpg']),
		('11111111-1111-4111-8111-111111111216'::uuid, '소민', '보드게임 카페 단골이에요. 여유로운 브런치를 좋아해요. 여유롭게 시간 보내요.', 38000, 2003, array['보드게임', '브런치', '전시 관람'], array[1, 2, 3, 4, 5]::smallint[], '홍대·마포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-216-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-216-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-216-3.jpg']),
		('11111111-1111-4111-8111-111111111217'::uuid, '지안', '여유로운 브런치를 좋아해요. 전시 보러 다니는 걸 좋아해요. 웃으면서 얘기해요.', 33000, 2004, array['브런치', '전시 관람'], array[0, 1, 2, 3, 4, 5, 6]::smallint[], '성수·성동', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-217-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-217-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-217-3.jpg']),
		('11111111-1111-4111-8111-111111111218'::uuid, '아윤', '전시 보러 다니는 걸 좋아해요. 영화 이야기 나누는 걸 좋아해요. 편안한 분위기 좋아해요.', 28000, 1996, array['전시 관람', '영화'], array[1, 2, 3, 4, 5, 6]::smallint[], '잠실·송파', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-218-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-218-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-218-3.jpg']),
		('11111111-1111-4111-8111-111111111219'::uuid, '다연', '영화 이야기 나누는 걸 좋아해요. 서점에서 책 구경하는 시간을 좋아해요. 즐겁게 얘기 나눠요.', 23000, 1997, array['영화', '서점 데이트', '카페 투어'], array[5, 6, 0]::smallint[], '여의도·영등포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-219-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-219-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-219-3.jpg']),
		('11111111-1111-4111-8111-111111111220'::uuid, '수아', '서점에서 책 구경하는 시간을 좋아해요. 예쁜 카페 찾아다니는 걸 좋아해요. 소소한 얘기 좋아해요.', 42000, 1998, array['서점 데이트', '카페 투어'], array[2, 4, 6]::smallint[], '종로·중구', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-220-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-220-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-220-3.jpg']),
		('11111111-1111-4111-8111-111111111221'::uuid, '예나', '예쁜 카페 찾아다니는 걸 좋아해요. 숨은 맛집 찾아다니는 게 취미예요. 편하게 대화 나눠요.', 37000, 1999, array['카페 투어', '맛집 탐방'], array[1, 3, 5]::smallint[], '기타', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-221-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-221-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-221-3.jpg']),
		('11111111-1111-4111-8111-111111111222'::uuid, '소연', '숨은 맛집 찾아다니는 게 취미예요. 사진 찍는 걸 좋아해요. 즐거운 시간 함께해요.', 32000, 2000, array['맛집 탐방', '사진', '디저트 투어'], array[0, 6]::smallint[], '강남·서초', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-222-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-222-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-222-3.jpg']),
		('11111111-1111-4111-8111-111111111223'::uuid, '지원', '사진 찍는 걸 좋아해요. 디저트 맛집 탐방을 즐겨요. 새로운 곳 같이 가봐요.', 27000, 2001, array['사진', '디저트 투어'], array[1, 2, 3, 4, 5]::smallint[], '홍대·마포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-223-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-223-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-223-3.jpg']),
		('11111111-1111-4111-8111-111111111224'::uuid, '나은', '디저트 맛집 탐방을 즐겨요. 한강이나 공원 산책을 즐겨요. 가볍게 만나요.', 22000, 2002, array['디저트 투어', '산책'], array[0, 1, 2, 3, 4, 5, 6]::smallint[], '성수·성동', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-224-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-224-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-224-3.jpg']),
		('11111111-1111-4111-8111-111111111225'::uuid, '유빈', '한강이나 공원 산책을 즐겨요. 보드게임 카페 단골이에요. 좋은 얘기 많이 나눠요.', 41000, 2003, array['산책', '보드게임', '브런치'], array[1, 2, 3, 4, 5, 6]::smallint[], '잠실·송파', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-225-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-225-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-225-3.jpg']),
		('11111111-1111-4111-8111-111111111226'::uuid, '채린', '보드게임 카페 단골이에요. 여유로운 브런치를 좋아해요. 여유롭게 시간 보내요.', 36000, 2004, array['보드게임', '브런치'], array[5, 6, 0]::smallint[], '여의도·영등포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-226-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-226-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-226-3.jpg']),
		('11111111-1111-4111-8111-111111111227'::uuid, '은서', '여유로운 브런치를 좋아해요. 전시 보러 다니는 걸 좋아해요. 웃으면서 얘기해요.', 31000, 1996, array['브런치', '전시 관람'], array[2, 4, 6]::smallint[], '종로·중구', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-227-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-227-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-227-3.jpg']),
		('11111111-1111-4111-8111-111111111228'::uuid, '하율', '전시 보러 다니는 걸 좋아해요. 영화 이야기 나누는 걸 좋아해요. 편안한 분위기 좋아해요.', 26000, 1997, array['전시 관람', '영화', '서점 데이트'], array[1, 3, 5]::smallint[], '기타', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-228-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-228-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-228-3.jpg']),
		('11111111-1111-4111-8111-111111111229'::uuid, '서아', '영화 이야기 나누는 걸 좋아해요. 서점에서 책 구경하는 시간을 좋아해요. 즐겁게 얘기 나눠요.', 45000, 1998, array['영화', '서점 데이트'], array[0, 6]::smallint[], '강남·서초', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-229-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-229-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-229-3.jpg']),
		('11111111-1111-4111-8111-111111111230'::uuid, '지유', '서점에서 책 구경하는 시간을 좋아해요. 예쁜 카페 찾아다니는 걸 좋아해요. 소소한 얘기 좋아해요.', 40000, 1999, array['서점 데이트', '카페 투어'], array[1, 2, 3, 4, 5]::smallint[], '홍대·마포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-230-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-230-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-230-3.jpg']),
		('11111111-1111-4111-8111-111111111231'::uuid, '유민', '예쁜 카페 찾아다니는 걸 좋아해요. 숨은 맛집 찾아다니는 게 취미예요. 편하게 대화 나눠요.', 35000, 2000, array['카페 투어', '맛집 탐방', '사진'], array[0, 1, 2, 3, 4, 5, 6]::smallint[], '성수·성동', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-231-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-231-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-231-3.jpg']),
		('11111111-1111-4111-8111-111111111232'::uuid, '서율', '숨은 맛집 찾아다니는 게 취미예요. 사진 찍는 걸 좋아해요. 즐거운 시간 함께해요.', 30000, 2001, array['맛집 탐방', '사진'], array[1, 2, 3, 4, 5, 6]::smallint[], '잠실·송파', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-232-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-232-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-232-3.jpg']),
		('11111111-1111-4111-8111-111111111233'::uuid, '하영', '사진 찍는 걸 좋아해요. 디저트 맛집 탐방을 즐겨요. 새로운 곳 같이 가봐요.', 25000, 2002, array['사진', '디저트 투어'], array[5, 6, 0]::smallint[], '여의도·영등포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-233-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-233-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-233-3.jpg']),
		('11111111-1111-4111-8111-111111111234'::uuid, '소은', '디저트 맛집 탐방을 즐겨요. 한강이나 공원 산책을 즐겨요. 가볍게 만나요.', 44000, 2003, array['디저트 투어', '산책', '보드게임'], array[2, 4, 6]::smallint[], '종로·중구', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-234-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-234-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-234-3.jpg']),
		('11111111-1111-4111-8111-111111111235'::uuid, '다현', '한강이나 공원 산책을 즐겨요. 보드게임 카페 단골이에요. 좋은 얘기 많이 나눠요.', 39000, 2004, array['산책', '보드게임'], array[1, 3, 5]::smallint[], '기타', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-235-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-235-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-235-3.jpg']),
		('11111111-1111-4111-8111-111111111236'::uuid, '채민', '보드게임 카페 단골이에요. 여유로운 브런치를 좋아해요. 여유롭게 시간 보내요.', 34000, 1996, array['보드게임', '브런치'], array[0, 6]::smallint[], '강남·서초', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-236-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-236-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-236-3.jpg']),
		('11111111-1111-4111-8111-111111111237'::uuid, '지수', '여유로운 브런치를 좋아해요. 전시 보러 다니는 걸 좋아해요. 웃으면서 얘기해요.', 29000, 1997, array['브런치', '전시 관람', '영화'], array[1, 2, 3, 4, 5]::smallint[], '홍대·마포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-237-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-237-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-237-3.jpg']),
		('11111111-1111-4111-8111-111111111238'::uuid, '유리', '전시 보러 다니는 걸 좋아해요. 영화 이야기 나누는 걸 좋아해요. 편안한 분위기 좋아해요.', 24000, 1998, array['전시 관람', '영화'], array[0, 1, 2, 3, 4, 5, 6]::smallint[], '성수·성동', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-238-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-238-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-238-3.jpg']),
		('11111111-1111-4111-8111-111111111239'::uuid, '하나', '영화 이야기 나누는 걸 좋아해요. 서점에서 책 구경하는 시간을 좋아해요. 즐겁게 얘기 나눠요.', 43000, 1999, array['영화', '서점 데이트'], array[1, 2, 3, 4, 5, 6]::smallint[], '잠실·송파', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-239-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-239-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-239-3.jpg']),
		('11111111-1111-4111-8111-111111111240'::uuid, '서진', '서점에서 책 구경하는 시간을 좋아해요. 예쁜 카페 찾아다니는 걸 좋아해요. 소소한 얘기 좋아해요.', 38000, 2000, array['서점 데이트', '카페 투어', '맛집 탐방'], array[5, 6, 0]::smallint[], '여의도·영등포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-240-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-240-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-240-3.jpg']),
		('11111111-1111-4111-8111-111111111241'::uuid, '소영', '예쁜 카페 찾아다니는 걸 좋아해요. 숨은 맛집 찾아다니는 게 취미예요. 편하게 대화 나눠요.', 33000, 2001, array['카페 투어', '맛집 탐방'], array[2, 4, 6]::smallint[], '종로·중구', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-241-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-241-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-241-3.jpg']),
		('11111111-1111-4111-8111-111111111242'::uuid, '나연', '숨은 맛집 찾아다니는 게 취미예요. 사진 찍는 걸 좋아해요. 즐거운 시간 함께해요.', 28000, 2002, array['맛집 탐방', '사진'], array[1, 3, 5]::smallint[], '기타', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-242-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-242-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-242-3.jpg']),
		('11111111-1111-4111-8111-111111111243'::uuid, '다희', '사진 찍는 걸 좋아해요. 디저트 맛집 탐방을 즐겨요. 새로운 곳 같이 가봐요.', 23000, 2003, array['사진', '디저트 투어', '산책'], array[0, 6]::smallint[], '강남·서초', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-243-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-243-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-243-3.jpg']),
		('11111111-1111-4111-8111-111111111244'::uuid, '채아', '디저트 맛집 탐방을 즐겨요. 한강이나 공원 산책을 즐겨요. 가볍게 만나요.', 42000, 2004, array['디저트 투어', '산책'], array[1, 2, 3, 4, 5]::smallint[], '홍대·마포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-244-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-244-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-244-3.jpg']),
		('11111111-1111-4111-8111-111111111245'::uuid, '지은', '한강이나 공원 산책을 즐겨요. 보드게임 카페 단골이에요. 좋은 얘기 많이 나눠요.', 37000, 1996, array['산책', '보드게임'], array[0, 1, 2, 3, 4, 5, 6]::smallint[], '성수·성동', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-245-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-245-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-245-3.jpg']),
		('11111111-1111-4111-8111-111111111246'::uuid, '규리', '보드게임 카페 단골이에요. 여유로운 브런치를 좋아해요. 여유롭게 시간 보내요.', 32000, 1997, array['보드게임', '브런치', '전시 관람'], array[1, 2, 3, 4, 5, 6]::smallint[], '잠실·송파', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-246-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-246-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-246-3.jpg']),
		('11111111-1111-4111-8111-111111111247'::uuid, '소원', '여유로운 브런치를 좋아해요. 전시 보러 다니는 걸 좋아해요. 웃으면서 얘기해요.', 27000, 1998, array['브런치', '전시 관람'], array[5, 6, 0]::smallint[], '여의도·영등포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-247-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-247-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-247-3.jpg']),
		('11111111-1111-4111-8111-111111111248'::uuid, '다솔', '전시 보러 다니는 걸 좋아해요. 영화 이야기 나누는 걸 좋아해요. 편안한 분위기 좋아해요.', 22000, 1999, array['전시 관람', '영화'], array[2, 4, 6]::smallint[], '종로·중구', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-248-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-248-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-248-3.jpg']),
		('11111111-1111-4111-8111-111111111249'::uuid, '지현', '영화 이야기 나누는 걸 좋아해요. 서점에서 책 구경하는 시간을 좋아해요. 즐겁게 얘기 나눠요.', 41000, 2000, array['영화', '서점 데이트', '카페 투어'], array[1, 3, 5]::smallint[], '기타', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-249-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-249-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-249-3.jpg']),
		('11111111-1111-4111-8111-111111111250'::uuid, '서현', '서점에서 책 구경하는 시간을 좋아해요. 예쁜 카페 찾아다니는 걸 좋아해요. 소소한 얘기 좋아해요.', 36000, 2001, array['서점 데이트', '카페 투어'], array[0, 6]::smallint[], '강남·서초', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-250-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-250-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-250-3.jpg'])
) as x(profile_id, nickname, bio, rate, birth_year, interests, weekdays, region, photo_urls)
on conflict (profile_id) do nothing;
