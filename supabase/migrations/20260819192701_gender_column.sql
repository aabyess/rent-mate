-- supabase/migrations/20260819192701_gender_column.sql
-- 성별 매칭 스프린트 ①: profiles·partner_profiles에 gender 추가.
-- 온보딩에서 본인이 선택해 insert하는 값이라 강제 트리거는 두지 않는다
-- (담당2가 온보딩 폼에서 profiles.gender를 받는다).

-- profiles.gender: nullable — 폴백 로직은 클라이언트에서 처리
alter table public.profiles
	add column gender text check (gender in ('male', 'female'));

-- 시드 파트너 56명(…101~106, …1201~1250)은 female. 두 시드 배치 모두
-- 동일한 9-1 접두사(11111111-1111-4111-8111-111111111)를 공유해 패턴 하나로 잡힌다.
update public.profiles
set gender = 'female'
where id::text like '11111111-1111-4111-8111-111111111%';

-- 그 외 기존 실계정은 male로 가정 (데모 단계 — 실제 성별 입력 UI가 없던 시절 가입한
-- 계정들이라 성별 데이터가 없음. QA 프로브 계정(qasweep*)은 실계정이 아니므로 제외 —
-- 남아있던 qasweep11(QA덱뷰어)은 별도 정리 예정, 여기서는 gender를 null로 둔다).
update public.profiles p
set gender = 'male'
from auth.users u
where u.id = p.id
	and p.gender is null
	and u.email not like 'qasweep%';

-- partner_profiles.gender: 목록 필터용 비정규화 컬럼 (profiles RLS가 남의 행 조회를
-- 막아서 파트너 목록 화면에서 직접 필터링하려면 partner_profiles에도 필요하다).
-- 먼저 nullable로 추가해 기존 56명을 백필한 뒤 not null을 건다.
alter table public.partner_profiles
	add column gender text check (gender in ('male', 'female'));

update public.partner_profiles
set gender = 'female'
where profile_id::text like '11111111-1111-4111-8111-111111111%';

alter table public.partner_profiles
	alter column gender set not null;
