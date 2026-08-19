-- supabase/migrations/20260819220000_partner_purpose_tags.sql
-- 파트너 용도 태그 (연애 연습 포지셔닝 ②). constants/purposeTags.ts의 PURPOSE_TAGS와 값 동기화 필요.
-- 담당1의 시드 확장(20260819184651)·사진 개수 제약(20260819184919) 이후에 적용한다.

alter table public.partner_profiles
	add column purpose_tags text[] not null default '{}';

-- 최초 6명(seed_partners) 분배
update public.partner_profiles set purpose_tags = array['연애 연습', '대화 연습']
	where profile_id = '11111111-1111-4111-8111-111111111101';
update public.partner_profiles set purpose_tags = array['취미 메이트']
	where profile_id = '11111111-1111-4111-8111-111111111102';
update public.partner_profiles set purpose_tags = array['첫 데이트 리허설', '연애 연습']
	where profile_id = '11111111-1111-4111-8111-111111111103';
update public.partner_profiles set purpose_tags = array['소개팅 예행연습']
	where profile_id = '11111111-1111-4111-8111-111111111104';
update public.partner_profiles set purpose_tags = array['대화 연습', '취미 메이트']
	where profile_id = '11111111-1111-4111-8111-111111111105';
update public.partner_profiles set purpose_tags = array['연애 연습']
	where profile_id = '11111111-1111-4111-8111-111111111106';

-- 확장 시드 50명(11111111-1111-4111-8111-1111111112NN, NN=01~50)에 결정적으로 1~2개씩 분배.
-- NN을 5로 나눈 나머지로 태그 1을 고르고, NN이 짝수면 태그 2를 추가한다.
do $$
declare
	tags text[] := array['연애 연습', '대화 연습', '첫 데이트 리허설', '소개팅 예행연습', '취미 메이트'];
	i int;
	pid uuid;
	assigned text[];
begin
	for i in 1..50 loop
		pid := ('11111111-1111-4111-8111-1111111112' || lpad(i::text, 2, '0'))::uuid;
		assigned := array[tags[(i % 5) + 1]];
		if i % 2 = 0 then
			assigned := assigned || tags[((i + 2) % 5) + 1];
		end if;

		update public.partner_profiles set purpose_tags = assigned where profile_id = pid;
	end loop;
end $$;
