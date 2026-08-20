-- supabase/migrations/20260820221500_token_wallets.sql
-- 토큰 시스템 v1. 지갑(token_wallets)은 잔액 캐시, 원장(token_ledger)이 근거.
-- 클라 쓰기는 전면 금지 — 잔액 변동은 반드시 spend_token 같은 security definer RPC를 거친다.

create table public.token_wallets (
	profile_id uuid primary key references public.profiles (id) on delete cascade,
	balance integer not null default 0 check (balance >= 0),
	updated_at timestamptz not null default now()
);

create table public.token_ledger (
	id uuid primary key default gen_random_uuid(),
	profile_id uuid not null references public.profiles (id) on delete cascade,
	amount integer not null,
	reason text not null,
	created_at timestamptz not null default now()
);

create index token_ledger_profile_id_idx on public.token_ledger (profile_id, created_at desc);

alter table public.token_wallets enable row level security;
alter table public.token_ledger enable row level security;

create policy "token_wallets_select_own" on public.token_wallets
	for select using (profile_id = auth.uid());
create policy "token_ledger_select_own" on public.token_ledger
	for select using (profile_id = auth.uid());

revoke insert, update, delete on public.token_wallets from anon, authenticated;
revoke insert, update, delete on public.token_ledger from anon, authenticated;

create function public.spend_token(p_reason text) returns integer
language plpgsql security definer
set search_path = public
as $$
declare
	v_balance integer;
begin
	select balance into v_balance from public.token_wallets where profile_id = auth.uid() for update;
	if not found or v_balance < 1 then
		raise exception '토큰이 부족해요';
	end if;

	update public.token_wallets
	set balance = balance - 1, updated_at = now()
	where profile_id = auth.uid();

	insert into public.token_ledger (profile_id, amount, reason)
	values (auth.uid(), -1, p_reason);

	return v_balance - 1;
end;
$$;

revoke execute on function public.spend_token(text) from public, anon;
grant execute on function public.spend_token(text) to authenticated;

-- 가입 시 지갑 없이 반쪽짜리 계정이 생기는 게 가입 실패보다 나쁘다고 판단해, 알림처럼
-- 실패를 삼키지 않고 그대로 가입 트랜잭션을 실패시킨다.
create function public.grant_welcome_tokens() returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
	insert into public.token_wallets (profile_id, balance) values (new.id, 5);
	insert into public.token_ledger (profile_id, amount, reason) values (new.id, 5, 'welcome');
	return new;
end;
$$;

create trigger profiles_grant_welcome_tokens
	after insert on public.profiles
	for each row execute function public.grant_welcome_tokens();

-- 백필: 기존 가입자 전원 5개 (on conflict do nothing로 재실행 안전)
insert into public.token_wallets (profile_id, balance)
select id, 5 from public.profiles
on conflict (profile_id) do nothing;

insert into public.token_ledger (profile_id, amount, reason)
select id, 5, 'welcome' from public.profiles p
where not exists (select 1 from public.token_ledger l where l.profile_id = p.id and l.reason = 'welcome');
