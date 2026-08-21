-- supabase/migrations/20260821121000_token_purchases.sql
-- 토큰 충전 v1 (토스 결제 연동). purchase 행은 클라가 pending으로 미리 만들고
-- (id를 토스 orderId로 사용), 결제 확인 후 grant_tokens(service_role 전용)가 적립한다.

create type public.token_purchase_status as enum ('pending', 'paid', 'failed');

create table public.token_purchases (
	id uuid primary key default gen_random_uuid(),
	profile_id uuid not null references public.profiles (id),
	product text not null,
	amount_krw integer not null check (amount_krw > 0),
	tokens integer not null check (tokens > 0),
	status public.token_purchase_status not null default 'pending',
	provider_payment_key text unique,
	approved_at timestamptz,
	created_at timestamptz not null default now()
);

create index token_purchases_profile_id_idx on public.token_purchases (profile_id);

alter table public.token_purchases enable row level security;

create policy "token_purchases_select_own_or_admin" on public.token_purchases
	for select using (profile_id = auth.uid() or public.is_admin());
create policy "token_purchases_insert_own" on public.token_purchases
	for insert with check (profile_id = auth.uid());

-- status 전이는 grant_tokens RPC(service_role 전용)만 — 클라 직접 update 금지
revoke update, delete on public.token_purchases from anon, authenticated;

create function public.grant_tokens(
	p_purchase_id uuid,
	p_profile_id uuid,
	p_provider_payment_key text,
	p_amount_krw integer
) returns integer
language plpgsql security definer
set search_path = public
as $$
declare
	v_purchase public.token_purchases%rowtype;
begin
	select * into v_purchase from public.token_purchases where id = p_purchase_id for update;
	if not found then
		raise exception 'purchase not found';
	end if;
	if v_purchase.profile_id <> p_profile_id then
		raise exception 'not purchase owner';
	end if;
	if v_purchase.amount_krw <> p_amount_krw then
		raise exception 'amount mismatch';
	end if;

	-- 클라가 pending 행을 직접 insert하므로 (product, amount_krw, tokens) 조합을 위조할 수 있다
	-- (예: amount_krw=5000인데 tokens=1200으로 만들어 ₩5,000만 내고 1,200개를 받으려는 시도).
	-- features/tokens/products.ts의 TOKEN_PRODUCTS와 반드시 동기화해서 유지할 것 — 여기가 최종 권위.
	if not (
		(v_purchase.product = 'tokens_100' and v_purchase.amount_krw = 5000 and v_purchase.tokens = 100)
		or (v_purchase.product = 'tokens_550' and v_purchase.amount_krw = 25000 and v_purchase.tokens = 550)
		or (v_purchase.product = 'tokens_1200' and v_purchase.amount_krw = 50000 and v_purchase.tokens = 1200)
	) then
		raise exception 'invalid product';
	end if;

	if v_purchase.status <> 'pending' then
		-- 멱등: 이미 처리된 주문이면 재적립 없이 현재 잔액만 반환
		return coalesce((select balance from public.token_wallets where profile_id = p_profile_id), 0);
	end if;

	update public.token_purchases
	set status = 'paid', provider_payment_key = p_provider_payment_key, approved_at = now()
	where id = p_purchase_id;

	update public.token_wallets
	set balance = balance + v_purchase.tokens, updated_at = now()
	where profile_id = p_profile_id;

	insert into public.token_ledger (profile_id, amount, reason)
	values (p_profile_id, v_purchase.tokens, 'purchase');

	return (select balance from public.token_wallets where profile_id = p_profile_id);
end;
$$;

revoke execute on function public.grant_tokens(uuid, uuid, text, integer) from public, anon, authenticated;
