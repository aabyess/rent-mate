-- supabase/migrations/20260819193045_seed_partner_pool_50_male.sql
-- 성별 매칭 스프린트 ②: 데모용 남성 시드 파트너 50명 추가 (20260819184651 패턴 확장).
-- ⚠️ 데모 전용: 사진은 사전 업로드 예정인 스톡 인물 사진(초상권 리스크, 정식 오픈
-- 전 실제 파트너 사진으로 교체 필수). 이름·소개는 전부 가상 인물이다.
-- 주의: 사진(seed/partner-301~350-{1,2,3}.jpg) 업로드 완료 통보 전까지 이
-- 마이그레이션은 DB에 push하지 않는다 (PM 업로드 진행 중).
--
-- profiles_enforce_customer_role 트리거가 모든 INSERT의 role을 customer로
-- 강제하므로(20260819165515), 기존 시드와 동일하게 role='partner'로 남기려면
-- 이 insert 구간만 잠시 해제해야 한다 (20260819184651과 동일 근거).

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
		('11111111-1111-4111-8111-111111111301'::uuid, 'partner013@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111302'::uuid, 'partner023@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111303'::uuid, 'partner033@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111304'::uuid, 'partner043@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111305'::uuid, 'partner053@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111306'::uuid, 'partner063@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111307'::uuid, 'partner073@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111308'::uuid, 'partner083@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111309'::uuid, 'partner093@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111310'::uuid, 'partner103@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111311'::uuid, 'partner113@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111312'::uuid, 'partner123@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111313'::uuid, 'partner133@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111314'::uuid, 'partner143@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111315'::uuid, 'partner153@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111316'::uuid, 'partner163@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111317'::uuid, 'partner173@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111318'::uuid, 'partner183@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111319'::uuid, 'partner193@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111320'::uuid, 'partner203@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111321'::uuid, 'partner213@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111322'::uuid, 'partner223@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111323'::uuid, 'partner233@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111324'::uuid, 'partner243@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111325'::uuid, 'partner253@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111326'::uuid, 'partner263@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111327'::uuid, 'partner273@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111328'::uuid, 'partner283@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111329'::uuid, 'partner293@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111330'::uuid, 'partner303@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111331'::uuid, 'partner313@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111332'::uuid, 'partner323@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111333'::uuid, 'partner333@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111334'::uuid, 'partner343@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111335'::uuid, 'partner353@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111336'::uuid, 'partner363@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111337'::uuid, 'partner373@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111338'::uuid, 'partner383@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111339'::uuid, 'partner393@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111340'::uuid, 'partner403@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111341'::uuid, 'partner413@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111342'::uuid, 'partner423@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111343'::uuid, 'partner433@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111344'::uuid, 'partner443@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111345'::uuid, 'partner453@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111346'::uuid, 'partner463@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111347'::uuid, 'partner473@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111348'::uuid, 'partner483@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111349'::uuid, 'partner493@seed.rentmate.local'),
		('11111111-1111-4111-8111-111111111350'::uuid, 'partner503@seed.rentmate.local')
) as x(id, email)
on conflict (id) do nothing;

-- enforce_adult_verification 트리거가 birth_date를 필수로 요구하므로 함께 지정한다
-- (adult_verified_at은 그 트리거가 now()로 자동 세팅하므로 여기 값은 덮어써짐).
insert into public.profiles (id, role, name, gender, birth_date, phone_verified_at, adult_verified_at)
select x.id, 'partner', x.name, 'male', x.birth_date, now(), now()
from (
	values
		('11111111-1111-4111-8111-111111111301'::uuid, '김민준', date '2001-01-01'),
		('11111111-1111-4111-8111-111111111302'::uuid, '이서준', date '1998-01-01'),
		('11111111-1111-4111-8111-111111111303'::uuid, '박도윤', date '1995-01-01'),
		('11111111-1111-4111-8111-111111111304'::uuid, '최예준', date '2002-01-01'),
		('11111111-1111-4111-8111-111111111305'::uuid, '정시우', date '1999-01-01'),
		('11111111-1111-4111-8111-111111111306'::uuid, '강하준', date '1996-01-01'),
		('11111111-1111-4111-8111-111111111307'::uuid, '조주원', date '2003-01-01'),
		('11111111-1111-4111-8111-111111111308'::uuid, '윤지호', date '2000-01-01'),
		('11111111-1111-4111-8111-111111111309'::uuid, '장지후', date '1997-01-01'),
		('11111111-1111-4111-8111-111111111310'::uuid, '임준서', date '1994-01-01'),
		('11111111-1111-4111-8111-111111111311'::uuid, '한준우', date '2001-01-01'),
		('11111111-1111-4111-8111-111111111312'::uuid, '오현우', date '1998-01-01'),
		('11111111-1111-4111-8111-111111111313'::uuid, '서도현', date '1995-01-01'),
		('11111111-1111-4111-8111-111111111314'::uuid, '신건우', date '2002-01-01'),
		('11111111-1111-4111-8111-111111111315'::uuid, '권우진', date '1999-01-01'),
		('11111111-1111-4111-8111-111111111316'::uuid, '황선우', date '1996-01-01'),
		('11111111-1111-4111-8111-111111111317'::uuid, '안서진', date '2003-01-01'),
		('11111111-1111-4111-8111-111111111318'::uuid, '송연우', date '2000-01-01'),
		('11111111-1111-4111-8111-111111111319'::uuid, '류정우', date '1997-01-01'),
		('11111111-1111-4111-8111-111111111320'::uuid, '전승우', date '1994-01-01'),
		('11111111-1111-4111-8111-111111111321'::uuid, '김승현', date '2001-01-01'),
		('11111111-1111-4111-8111-111111111322'::uuid, '이시윤', date '1998-01-01'),
		('11111111-1111-4111-8111-111111111323'::uuid, '박준혁', date '1995-01-01'),
		('11111111-1111-4111-8111-111111111324'::uuid, '최은우', date '2002-01-01'),
		('11111111-1111-4111-8111-111111111325'::uuid, '정지훈', date '1999-01-01'),
		('11111111-1111-4111-8111-111111111326'::uuid, '강재윤', date '1996-01-01'),
		('11111111-1111-4111-8111-111111111327'::uuid, '조태윤', date '2003-01-01'),
		('11111111-1111-4111-8111-111111111328'::uuid, '윤유준', date '2000-01-01'),
		('11111111-1111-4111-8111-111111111329'::uuid, '장민재', date '1997-01-01'),
		('11111111-1111-4111-8111-111111111330'::uuid, '임준영', date '1994-01-01'),
		('11111111-1111-4111-8111-111111111331'::uuid, '한현준', date '2001-01-01'),
		('11111111-1111-4111-8111-111111111332'::uuid, '오지환', date '1998-01-01'),
		('11111111-1111-4111-8111-111111111333'::uuid, '서승준', date '1995-01-01'),
		('11111111-1111-4111-8111-111111111334'::uuid, '신도훈', date '2002-01-01'),
		('11111111-1111-4111-8111-111111111335'::uuid, '권시온', date '1999-01-01'),
		('11111111-1111-4111-8111-111111111336'::uuid, '황강민', date '1996-01-01'),
		('11111111-1111-4111-8111-111111111337'::uuid, '안예성', date '2003-01-01'),
		('11111111-1111-4111-8111-111111111338'::uuid, '송재현', date '2000-01-01'),
		('11111111-1111-4111-8111-111111111339'::uuid, '류준형', date '1997-01-01'),
		('11111111-1111-4111-8111-111111111340'::uuid, '전성민', date '1994-01-01'),
		('11111111-1111-4111-8111-111111111341'::uuid, '김태민', date '2001-01-01'),
		('11111111-1111-4111-8111-111111111342'::uuid, '이동현', date '1998-01-01'),
		('11111111-1111-4111-8111-111111111343'::uuid, '박지원', date '1995-01-01'),
		('11111111-1111-4111-8111-111111111344'::uuid, '최규현', date '2002-01-01'),
		('11111111-1111-4111-8111-111111111345'::uuid, '정승호', date '1999-01-01'),
		('11111111-1111-4111-8111-111111111346'::uuid, '강동욱', date '1996-01-01'),
		('11111111-1111-4111-8111-111111111347'::uuid, '조재원', date '2003-01-01'),
		('11111111-1111-4111-8111-111111111348'::uuid, '윤민호', date '2000-01-01'),
		('11111111-1111-4111-8111-111111111349'::uuid, '장상현', date '1997-01-01'),
		('11111111-1111-4111-8111-111111111350'::uuid, '임준수', date '1994-01-01')
) as x(id, name, birth_date)
on conflict (id) do nothing;

alter table public.profiles enable trigger profiles_enforce_customer_role;

insert into public.partner_profiles
	(profile_id, nickname, bio, hourly_rate_krw, birth_year, interests, available_weekdays, region, photo_urls, purpose_tags, gender, is_approved, is_active)
select x.profile_id, x.nickname, x.bio, x.rate, x.birth_year, x.interests, x.weekdays, x.region, x.photo_urls, x.purpose_tags, 'male', true, true
from (
	values
		('11111111-1111-4111-8111-111111111301'::uuid, '민준', '예쁜 카페 찾아다니는 걸 좋아해요. 숨은 맛집 찾아다니는 게 취미예요. 편하게 대화 나눠요.', 45000, 2001, array['카페 투어', '맛집 탐방', '사진'], array[0, 6]::smallint[], '강남·서초', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-301-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-301-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-301-3.jpg'], array['대화 연습']),
		('11111111-1111-4111-8111-111111111302'::uuid, '서준', '영화 이야기 나누는 걸 좋아해요. 서점에서 책 구경하는 시간을 좋아해요. 즐거운 시간 함께해요.', 44000, 1998, array['영화', '서점 데이트'], array[1, 2, 3, 4, 5]::smallint[], '홍대·마포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-302-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-302-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-302-3.jpg'], array['첫 데이트 리허설', '취미 메이트']),
		('11111111-1111-4111-8111-111111111303'::uuid, '도윤', '여유로운 브런치를 좋아해요. 전시 보러 다니는 걸 좋아해요. 새로운 곳 같이 가봐요.', 43000, 1995, array['브런치', '전시 관람'], array[0, 1, 2, 3, 4, 5, 6]::smallint[], '성수·성동', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-303-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-303-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-303-3.jpg'], array['소개팅 예행연습']),
		('11111111-1111-4111-8111-111111111304'::uuid, '예준', '한강이나 공원 산책을 즐겨요. 보드게임 카페 단골이에요. 가볍게 만나요.', 42000, 2002, array['산책', '보드게임', '브런치'], array[1, 2, 3, 4, 5, 6]::smallint[], '잠실·송파', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-304-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-304-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-304-3.jpg'], array['취미 메이트', '대화 연습']),
		('11111111-1111-4111-8111-111111111305'::uuid, '시우', '사진 찍는 걸 좋아해요. 디저트 맛집 탐방을 즐겨요. 좋은 얘기 많이 나눠요.', 41000, 1999, array['사진', '디저트 투어'], array[5, 6, 0]::smallint[], '여의도·영등포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-305-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-305-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-305-3.jpg'], array['연애 연습']),
		('11111111-1111-4111-8111-111111111306'::uuid, '하준', '예쁜 카페 찾아다니는 걸 좋아해요. 숨은 맛집 찾아다니는 게 취미예요. 여유롭게 시간 보내요.', 40000, 1996, array['카페 투어', '맛집 탐방'], array[2, 4, 6]::smallint[], '종로·중구', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-306-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-306-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-306-3.jpg'], array['대화 연습', '소개팅 예행연습']),
		('11111111-1111-4111-8111-111111111307'::uuid, '주원', '영화 이야기 나누는 걸 좋아해요. 서점에서 책 구경하는 시간을 좋아해요. 웃으면서 얘기해요.', 39000, 2003, array['영화', '서점 데이트', '카페 투어'], array[1, 3, 5]::smallint[], '기타', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-307-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-307-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-307-3.jpg'], array['첫 데이트 리허설']),
		('11111111-1111-4111-8111-111111111308'::uuid, '지호', '여유로운 브런치를 좋아해요. 전시 보러 다니는 걸 좋아해요. 편안한 분위기 좋아해요.', 38000, 2000, array['브런치', '전시 관람'], array[0, 6]::smallint[], '강남·서초', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-308-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-308-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-308-3.jpg'], array['소개팅 예행연습', '연애 연습']),
		('11111111-1111-4111-8111-111111111309'::uuid, '지후', '한강이나 공원 산책을 즐겨요. 보드게임 카페 단골이에요. 즐겁게 얘기 나눠요.', 37000, 1997, array['산책', '보드게임'], array[1, 2, 3, 4, 5]::smallint[], '홍대·마포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-309-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-309-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-309-3.jpg'], array['취미 메이트']),
		('11111111-1111-4111-8111-111111111310'::uuid, '준서', '사진 찍는 걸 좋아해요. 디저트 맛집 탐방을 즐겨요. 소소한 얘기 좋아해요.', 36000, 1994, array['사진', '디저트 투어', '산책'], array[0, 1, 2, 3, 4, 5, 6]::smallint[], '성수·성동', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-310-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-310-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-310-3.jpg'], array['연애 연습', '첫 데이트 리허설']),
		('11111111-1111-4111-8111-111111111311'::uuid, '준우', '예쁜 카페 찾아다니는 걸 좋아해요. 숨은 맛집 찾아다니는 게 취미예요. 편하게 대화 나눠요.', 35000, 2001, array['카페 투어', '맛집 탐방'], array[1, 2, 3, 4, 5, 6]::smallint[], '잠실·송파', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-311-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-311-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-311-3.jpg'], array['대화 연습']),
		('11111111-1111-4111-8111-111111111312'::uuid, '현우', '영화 이야기 나누는 걸 좋아해요. 서점에서 책 구경하는 시간을 좋아해요. 즐거운 시간 함께해요.', 34000, 1998, array['영화', '서점 데이트'], array[5, 6, 0]::smallint[], '여의도·영등포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-312-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-312-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-312-3.jpg'], array['첫 데이트 리허설', '취미 메이트']),
		('11111111-1111-4111-8111-111111111313'::uuid, '도현', '여유로운 브런치를 좋아해요. 전시 보러 다니는 걸 좋아해요. 새로운 곳 같이 가봐요.', 33000, 1995, array['브런치', '전시 관람', '영화'], array[2, 4, 6]::smallint[], '종로·중구', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-313-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-313-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-313-3.jpg'], array['소개팅 예행연습']),
		('11111111-1111-4111-8111-111111111314'::uuid, '건우', '한강이나 공원 산책을 즐겨요. 보드게임 카페 단골이에요. 가볍게 만나요.', 32000, 2002, array['산책', '보드게임'], array[1, 3, 5]::smallint[], '기타', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-314-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-314-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-314-3.jpg'], array['취미 메이트', '대화 연습']),
		('11111111-1111-4111-8111-111111111315'::uuid, '우진', '사진 찍는 걸 좋아해요. 디저트 맛집 탐방을 즐겨요. 좋은 얘기 많이 나눠요.', 31000, 1999, array['사진', '디저트 투어'], array[0, 6]::smallint[], '강남·서초', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-315-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-315-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-315-3.jpg'], array['연애 연습']),
		('11111111-1111-4111-8111-111111111316'::uuid, '선우', '예쁜 카페 찾아다니는 걸 좋아해요. 숨은 맛집 찾아다니는 게 취미예요. 여유롭게 시간 보내요.', 30000, 1996, array['카페 투어', '맛집 탐방', '사진'], array[1, 2, 3, 4, 5]::smallint[], '홍대·마포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-316-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-316-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-316-3.jpg'], array['대화 연습', '소개팅 예행연습']),
		('11111111-1111-4111-8111-111111111317'::uuid, '서진', '영화 이야기 나누는 걸 좋아해요. 서점에서 책 구경하는 시간을 좋아해요. 웃으면서 얘기해요.', 29000, 2003, array['영화', '서점 데이트'], array[0, 1, 2, 3, 4, 5, 6]::smallint[], '성수·성동', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-317-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-317-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-317-3.jpg'], array['첫 데이트 리허설']),
		('11111111-1111-4111-8111-111111111318'::uuid, '연우', '여유로운 브런치를 좋아해요. 전시 보러 다니는 걸 좋아해요. 편안한 분위기 좋아해요.', 28000, 2000, array['브런치', '전시 관람'], array[1, 2, 3, 4, 5, 6]::smallint[], '잠실·송파', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-318-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-318-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-318-3.jpg'], array['소개팅 예행연습', '연애 연습']),
		('11111111-1111-4111-8111-111111111319'::uuid, '정우', '한강이나 공원 산책을 즐겨요. 보드게임 카페 단골이에요. 즐겁게 얘기 나눠요.', 27000, 1997, array['산책', '보드게임', '브런치'], array[5, 6, 0]::smallint[], '여의도·영등포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-319-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-319-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-319-3.jpg'], array['취미 메이트']),
		('11111111-1111-4111-8111-111111111320'::uuid, '승우', '사진 찍는 걸 좋아해요. 디저트 맛집 탐방을 즐겨요. 소소한 얘기 좋아해요.', 26000, 1994, array['사진', '디저트 투어'], array[2, 4, 6]::smallint[], '종로·중구', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-320-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-320-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-320-3.jpg'], array['연애 연습', '첫 데이트 리허설']),
		('11111111-1111-4111-8111-111111111321'::uuid, '승현', '예쁜 카페 찾아다니는 걸 좋아해요. 숨은 맛집 찾아다니는 게 취미예요. 편하게 대화 나눠요.', 25000, 2001, array['카페 투어', '맛집 탐방'], array[1, 3, 5]::smallint[], '기타', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-321-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-321-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-321-3.jpg'], array['대화 연습']),
		('11111111-1111-4111-8111-111111111322'::uuid, '시윤', '영화 이야기 나누는 걸 좋아해요. 서점에서 책 구경하는 시간을 좋아해요. 즐거운 시간 함께해요.', 24000, 1998, array['영화', '서점 데이트', '카페 투어'], array[0, 6]::smallint[], '강남·서초', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-322-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-322-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-322-3.jpg'], array['첫 데이트 리허설', '취미 메이트']),
		('11111111-1111-4111-8111-111111111323'::uuid, '준혁', '여유로운 브런치를 좋아해요. 전시 보러 다니는 걸 좋아해요. 새로운 곳 같이 가봐요.', 23000, 1995, array['브런치', '전시 관람'], array[1, 2, 3, 4, 5]::smallint[], '홍대·마포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-323-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-323-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-323-3.jpg'], array['소개팅 예행연습']),
		('11111111-1111-4111-8111-111111111324'::uuid, '은우', '한강이나 공원 산책을 즐겨요. 보드게임 카페 단골이에요. 가볍게 만나요.', 22000, 2002, array['산책', '보드게임'], array[0, 1, 2, 3, 4, 5, 6]::smallint[], '성수·성동', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-324-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-324-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-324-3.jpg'], array['취미 메이트', '대화 연습']),
		('11111111-1111-4111-8111-111111111325'::uuid, '지훈', '사진 찍는 걸 좋아해요. 디저트 맛집 탐방을 즐겨요. 좋은 얘기 많이 나눠요.', 45000, 1999, array['사진', '디저트 투어', '산책'], array[1, 2, 3, 4, 5, 6]::smallint[], '잠실·송파', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-325-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-325-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-325-3.jpg'], array['연애 연습']),
		('11111111-1111-4111-8111-111111111326'::uuid, '재윤', '예쁜 카페 찾아다니는 걸 좋아해요. 숨은 맛집 찾아다니는 게 취미예요. 여유롭게 시간 보내요.', 44000, 1996, array['카페 투어', '맛집 탐방'], array[5, 6, 0]::smallint[], '여의도·영등포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-326-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-326-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-326-3.jpg'], array['대화 연습', '소개팅 예행연습']),
		('11111111-1111-4111-8111-111111111327'::uuid, '태윤', '영화 이야기 나누는 걸 좋아해요. 서점에서 책 구경하는 시간을 좋아해요. 웃으면서 얘기해요.', 43000, 2003, array['영화', '서점 데이트'], array[2, 4, 6]::smallint[], '종로·중구', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-327-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-327-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-327-3.jpg'], array['첫 데이트 리허설']),
		('11111111-1111-4111-8111-111111111328'::uuid, '유준', '여유로운 브런치를 좋아해요. 전시 보러 다니는 걸 좋아해요. 편안한 분위기 좋아해요.', 42000, 2000, array['브런치', '전시 관람', '영화'], array[1, 3, 5]::smallint[], '기타', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-328-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-328-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-328-3.jpg'], array['소개팅 예행연습', '연애 연습']),
		('11111111-1111-4111-8111-111111111329'::uuid, '민재', '한강이나 공원 산책을 즐겨요. 보드게임 카페 단골이에요. 즐겁게 얘기 나눠요.', 41000, 1997, array['산책', '보드게임'], array[0, 6]::smallint[], '강남·서초', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-329-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-329-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-329-3.jpg'], array['취미 메이트']),
		('11111111-1111-4111-8111-111111111330'::uuid, '준영', '사진 찍는 걸 좋아해요. 디저트 맛집 탐방을 즐겨요. 소소한 얘기 좋아해요.', 40000, 1994, array['사진', '디저트 투어'], array[1, 2, 3, 4, 5]::smallint[], '홍대·마포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-330-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-330-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-330-3.jpg'], array['연애 연습', '첫 데이트 리허설']),
		('11111111-1111-4111-8111-111111111331'::uuid, '현준', '예쁜 카페 찾아다니는 걸 좋아해요. 숨은 맛집 찾아다니는 게 취미예요. 편하게 대화 나눠요.', 39000, 2001, array['카페 투어', '맛집 탐방', '사진'], array[0, 1, 2, 3, 4, 5, 6]::smallint[], '성수·성동', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-331-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-331-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-331-3.jpg'], array['대화 연습']),
		('11111111-1111-4111-8111-111111111332'::uuid, '지환', '영화 이야기 나누는 걸 좋아해요. 서점에서 책 구경하는 시간을 좋아해요. 즐거운 시간 함께해요.', 38000, 1998, array['영화', '서점 데이트'], array[1, 2, 3, 4, 5, 6]::smallint[], '잠실·송파', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-332-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-332-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-332-3.jpg'], array['첫 데이트 리허설', '취미 메이트']),
		('11111111-1111-4111-8111-111111111333'::uuid, '승준', '여유로운 브런치를 좋아해요. 전시 보러 다니는 걸 좋아해요. 새로운 곳 같이 가봐요.', 37000, 1995, array['브런치', '전시 관람'], array[5, 6, 0]::smallint[], '여의도·영등포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-333-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-333-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-333-3.jpg'], array['소개팅 예행연습']),
		('11111111-1111-4111-8111-111111111334'::uuid, '도훈', '한강이나 공원 산책을 즐겨요. 보드게임 카페 단골이에요. 가볍게 만나요.', 36000, 2002, array['산책', '보드게임', '브런치'], array[2, 4, 6]::smallint[], '종로·중구', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-334-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-334-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-334-3.jpg'], array['취미 메이트', '대화 연습']),
		('11111111-1111-4111-8111-111111111335'::uuid, '시온', '사진 찍는 걸 좋아해요. 디저트 맛집 탐방을 즐겨요. 좋은 얘기 많이 나눠요.', 35000, 1999, array['사진', '디저트 투어'], array[1, 3, 5]::smallint[], '기타', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-335-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-335-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-335-3.jpg'], array['연애 연습']),
		('11111111-1111-4111-8111-111111111336'::uuid, '강민', '예쁜 카페 찾아다니는 걸 좋아해요. 숨은 맛집 찾아다니는 게 취미예요. 여유롭게 시간 보내요.', 34000, 1996, array['카페 투어', '맛집 탐방'], array[0, 6]::smallint[], '강남·서초', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-336-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-336-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-336-3.jpg'], array['대화 연습', '소개팅 예행연습']),
		('11111111-1111-4111-8111-111111111337'::uuid, '예성', '영화 이야기 나누는 걸 좋아해요. 서점에서 책 구경하는 시간을 좋아해요. 웃으면서 얘기해요.', 33000, 2003, array['영화', '서점 데이트', '카페 투어'], array[1, 2, 3, 4, 5]::smallint[], '홍대·마포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-337-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-337-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-337-3.jpg'], array['첫 데이트 리허설']),
		('11111111-1111-4111-8111-111111111338'::uuid, '재현', '여유로운 브런치를 좋아해요. 전시 보러 다니는 걸 좋아해요. 편안한 분위기 좋아해요.', 32000, 2000, array['브런치', '전시 관람'], array[0, 1, 2, 3, 4, 5, 6]::smallint[], '성수·성동', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-338-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-338-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-338-3.jpg'], array['소개팅 예행연습', '연애 연습']),
		('11111111-1111-4111-8111-111111111339'::uuid, '준형', '한강이나 공원 산책을 즐겨요. 보드게임 카페 단골이에요. 즐겁게 얘기 나눠요.', 31000, 1997, array['산책', '보드게임'], array[1, 2, 3, 4, 5, 6]::smallint[], '잠실·송파', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-339-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-339-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-339-3.jpg'], array['취미 메이트']),
		('11111111-1111-4111-8111-111111111340'::uuid, '성민', '사진 찍는 걸 좋아해요. 디저트 맛집 탐방을 즐겨요. 소소한 얘기 좋아해요.', 30000, 1994, array['사진', '디저트 투어', '산책'], array[5, 6, 0]::smallint[], '여의도·영등포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-340-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-340-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-340-3.jpg'], array['연애 연습', '첫 데이트 리허설']),
		('11111111-1111-4111-8111-111111111341'::uuid, '태민', '예쁜 카페 찾아다니는 걸 좋아해요. 숨은 맛집 찾아다니는 게 취미예요. 편하게 대화 나눠요.', 29000, 2001, array['카페 투어', '맛집 탐방'], array[2, 4, 6]::smallint[], '종로·중구', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-341-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-341-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-341-3.jpg'], array['대화 연습']),
		('11111111-1111-4111-8111-111111111342'::uuid, '동현', '영화 이야기 나누는 걸 좋아해요. 서점에서 책 구경하는 시간을 좋아해요. 즐거운 시간 함께해요.', 28000, 1998, array['영화', '서점 데이트'], array[1, 3, 5]::smallint[], '기타', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-342-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-342-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-342-3.jpg'], array['첫 데이트 리허설', '취미 메이트']),
		('11111111-1111-4111-8111-111111111343'::uuid, '지원', '여유로운 브런치를 좋아해요. 전시 보러 다니는 걸 좋아해요. 새로운 곳 같이 가봐요.', 27000, 1995, array['브런치', '전시 관람', '영화'], array[0, 6]::smallint[], '강남·서초', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-343-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-343-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-343-3.jpg'], array['소개팅 예행연습']),
		('11111111-1111-4111-8111-111111111344'::uuid, '규현', '한강이나 공원 산책을 즐겨요. 보드게임 카페 단골이에요. 가볍게 만나요.', 26000, 2002, array['산책', '보드게임'], array[1, 2, 3, 4, 5]::smallint[], '홍대·마포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-344-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-344-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-344-3.jpg'], array['취미 메이트', '대화 연습']),
		('11111111-1111-4111-8111-111111111345'::uuid, '승호', '사진 찍는 걸 좋아해요. 디저트 맛집 탐방을 즐겨요. 좋은 얘기 많이 나눠요.', 25000, 1999, array['사진', '디저트 투어'], array[0, 1, 2, 3, 4, 5, 6]::smallint[], '성수·성동', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-345-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-345-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-345-3.jpg'], array['연애 연습']),
		('11111111-1111-4111-8111-111111111346'::uuid, '동욱', '예쁜 카페 찾아다니는 걸 좋아해요. 숨은 맛집 찾아다니는 게 취미예요. 여유롭게 시간 보내요.', 24000, 1996, array['카페 투어', '맛집 탐방', '사진'], array[1, 2, 3, 4, 5, 6]::smallint[], '잠실·송파', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-346-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-346-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-346-3.jpg'], array['대화 연습', '소개팅 예행연습']),
		('11111111-1111-4111-8111-111111111347'::uuid, '재원', '영화 이야기 나누는 걸 좋아해요. 서점에서 책 구경하는 시간을 좋아해요. 웃으면서 얘기해요.', 23000, 2003, array['영화', '서점 데이트'], array[5, 6, 0]::smallint[], '여의도·영등포', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-347-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-347-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-347-3.jpg'], array['첫 데이트 리허설']),
		('11111111-1111-4111-8111-111111111348'::uuid, '민호', '여유로운 브런치를 좋아해요. 전시 보러 다니는 걸 좋아해요. 편안한 분위기 좋아해요.', 22000, 2000, array['브런치', '전시 관람'], array[2, 4, 6]::smallint[], '종로·중구', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-348-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-348-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-348-3.jpg'], array['소개팅 예행연습', '연애 연습']),
		('11111111-1111-4111-8111-111111111349'::uuid, '상현', '한강이나 공원 산책을 즐겨요. 보드게임 카페 단골이에요. 즐겁게 얘기 나눠요.', 45000, 1997, array['산책', '보드게임', '브런치'], array[1, 3, 5]::smallint[], '기타', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-349-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-349-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-349-3.jpg'], array['취미 메이트']),
		('11111111-1111-4111-8111-111111111350'::uuid, '준수', '사진 찍는 걸 좋아해요. 디저트 맛집 탐방을 즐겨요. 소소한 얘기 좋아해요.', 44000, 1994, array['사진', '디저트 투어'], array[0, 6]::smallint[], '강남·서초', array['https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-350-1.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-350-2.jpg', 'https://xvnuvdsidzibpwrldink.supabase.co/storage/v1/object/public/partner-photos/seed/partner-350-3.jpg'], array['연애 연습', '첫 데이트 리허설'])
) as x(profile_id, nickname, bio, rate, birth_year, interests, weekdays, region, photo_urls, purpose_tags)
on conflict (profile_id) do nothing;
