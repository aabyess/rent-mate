-- supabase/migrations/20260820222000_token_economy.sql
-- 토큰 경제 확장: 웰컴 500 상향, 예약 요청/완료에 토큰 연동.

-- 1. 웰컴 500으로 상향
create or replace function public.grant_welcome_tokens() returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
	insert into public.token_wallets (profile_id, balance) values (new.id, 500);
	insert into public.token_ledger (profile_id, amount, reason) values (new.id, 500, 'welcome');
	return new;
end;
$$;

-- 기존에 welcome 5개를 받은 지갑만 +495 (재실행 안전 — welcome_upgrade 중복 방지)
update public.token_wallets w
set balance = balance + 495, updated_at = now()
where exists (
	select 1 from public.token_ledger l
	where l.profile_id = w.profile_id and l.reason = 'welcome' and l.amount = 5
)
and not exists (
	select 1 from public.token_ledger l2
	where l2.profile_id = w.profile_id and l2.reason = 'welcome_upgrade'
);

insert into public.token_ledger (profile_id, amount, reason)
select l.profile_id, 495, 'welcome_upgrade'
from public.token_ledger l
where l.reason = 'welcome' and l.amount = 5
and not exists (
	select 1 from public.token_ledger l2
	where l2.profile_id = l.profile_id and l2.reason = 'welcome_upgrade'
);

-- 2. 일반화된 spend_tokens(reason, amount) — 기존 spend_token(reason)은 시그니처 유지,
-- 내부에서 위임한다 (#104가 spend_token('rewind')를 이미 쓰고 있어 시그니처를 건드리지 않는다).
create function public.spend_tokens(p_reason text, p_amount integer) returns integer
language plpgsql security definer
set search_path = public
as $$
declare
	v_balance integer;
begin
	if p_amount <= 0 then
		raise exception 'invalid amount';
	end if;

	select balance into v_balance from public.token_wallets where profile_id = auth.uid() for update;
	if not found or v_balance < p_amount then
		raise exception '토큰이 부족해요';
	end if;

	update public.token_wallets
	set balance = balance - p_amount, updated_at = now()
	where profile_id = auth.uid();

	insert into public.token_ledger (profile_id, amount, reason)
	values (auth.uid(), -p_amount, p_reason);

	return v_balance - p_amount;
end;
$$;

revoke execute on function public.spend_tokens(text, integer) from public, anon;
grant execute on function public.spend_tokens(text, integer) to authenticated;

create or replace function public.spend_token(p_reason text) returns integer
language plpgsql security definer
set search_path = public
as $$
begin
	return public.spend_tokens(p_reason, 1);
end;
$$;

-- 3. 내부 전용 헬퍼 — 행위자(auth.uid())가 아니라 명시적 profile_id의 지갑을 차감한다
-- (파트너의 완료 처리가 고객 지갑을 차감하는 경우처럼 행위자≠지갑 소유자일 때 필요).
-- 트리거에서만 호출되고 클라에는 절대 노출하지 않는다.
create function public.deduct_tokens(
	p_profile_id uuid,
	p_reason text,
	p_amount integer,
	p_allow_partial boolean
) returns integer
language plpgsql security definer
set search_path = public
as $$
declare
	v_balance integer;
	v_deduct integer;
begin
	select balance into v_balance from public.token_wallets where profile_id = p_profile_id for update;
	if not found then
		v_balance := 0;
	end if;

	if v_balance < p_amount then
		if not p_allow_partial then
			raise exception '토큰이 부족해요';
		end if;
		v_deduct := v_balance;
	else
		v_deduct := p_amount;
	end if;

	if v_deduct > 0 then
		update public.token_wallets
		set balance = balance - v_deduct, updated_at = now()
		where profile_id = p_profile_id;

		insert into public.token_ledger (profile_id, amount, reason)
		values (p_profile_id, -v_deduct, p_reason);
	end if;

	return v_deduct;
end;
$$;

revoke execute on function public.deduct_tokens(uuid, text, integer, boolean) from public, anon, authenticated;

-- 4. 예약 요청 -10 (부족하면 예약 자체가 실패 — 클라이언트 우회 불가)
create function public.charge_booking_request_tokens() returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
	perform public.deduct_tokens(new.customer_id, 'booking_request', 10, false);
	return new;
end;
$$;

create trigger bookings_charge_request_tokens
	before insert on public.bookings
	for each row execute function public.charge_booking_request_tokens();

-- 5. 완료 -100, 잔액 부족해도 완료는 막지 않고 남은 만큼만 차감(0까지)
-- 주의: old<>'completed' 가드라 admin이 completed↔accepted를 수동으로 왕복시키면 매 왕복마다
-- 재차감된다(v1은 낮은 빈도로 수용 — 문제되면 ledger에 booking_id 태깅 + 유니크로 막을 것).
create function public.charge_completion_tokens() returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
	if new.status = 'completed' and old.status <> 'completed' then
		perform public.deduct_tokens(new.customer_id, 'date_completed', 100, true);
	end if;
	return new;
end;
$$;

create trigger bookings_charge_completion_tokens
	before update on public.bookings
	for each row execute function public.charge_completion_tokens();
