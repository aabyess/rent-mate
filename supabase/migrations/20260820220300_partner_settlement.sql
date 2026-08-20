-- supabase/migrations/20260820220300_partner_settlement.sql
-- 파트너 정산 사이클: 정산 계좌 등록 + 5% 플랫폼 수수료 + admin 정산 완료 처리.
--
-- 실서비스 주의: v1은 admin이 partner_payout_accounts에 저장된 계좌를 보고 수동
-- 송금하는 임시 운영 방식이다. 실제로는 플랫폼이 계좌번호를 직접 보관·송금하지
-- 않고 PG 지급대행(분리정산, 예: 토스페이먼츠 판매자 정산)으로 대체돼야 한다 —
-- 전자금융거래법상 자금이체업 등록 없이 타인 자금을 대신 송금하는 구조는 리스크가
-- 있다(사용자에게 이미 고지함).

create table public.partner_payout_accounts (
	partner_id uuid primary key references public.partner_profiles (profile_id) on delete cascade,
	bank_name text not null,
	account_holder text not null,
	account_number text not null,
	updated_at timestamptz not null default now()
);

alter table public.partner_payout_accounts enable row level security;

create policy "partner_payout_accounts_select_own_or_admin" on public.partner_payout_accounts
	for select using (partner_id = auth.uid() or public.is_admin());
create policy "partner_payout_accounts_insert_own" on public.partner_payout_accounts
	for insert with check (partner_id = auth.uid());
create policy "partner_payout_accounts_update_own" on public.partner_payout_accounts
	for update using (partner_id = auth.uid());

create function public.touch_partner_payout_accounts_updated_at() returns trigger
language plpgsql
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

create trigger partner_payout_accounts_touch_updated_at
	before update on public.partner_payout_accounts
	for each row execute function public.touch_partner_payout_accounts_updated_at();

alter table public.payments
	add column payout_amount_krw integer,
	add column payout_fee_krw integer,
	add column released_at timestamptz;

-- 정산 완료 전용 RPC. 수수료 5%는 features/bookings/utils.ts의 PLATFORM_FEE_RATIO와
-- 동일하게 유지할 것 — 클라이언트는 미리보기용, 여기가 최종 권위.
create function public.complete_partner_settlement(p_payment_id uuid)
returns table (payout_amount_krw integer, payout_fee_krw integer)
language plpgsql security definer
set search_path = public
as $$
declare
	v_payment public.payments%rowtype;
	v_partner_id uuid;
	v_fee integer;
	v_payout integer;
begin
	if not public.is_admin() then
		raise exception 'admin only';
	end if;

	select * into v_payment from public.payments where id = p_payment_id for update;
	if not found or v_payment.status <> 'paid' then
		raise exception 'payment not in paid status';
	end if;

	select partner_id into v_partner_id from public.bookings where id = v_payment.booking_id;

	v_fee := floor(v_payment.amount_krw * 0.05);
	v_payout := v_payment.amount_krw - v_fee;

	update public.payments
	set status = 'released', payout_amount_krw = v_payout, payout_fee_krw = v_fee, released_at = now()
	where id = p_payment_id;

	-- 알림 실패는 정산 자체를 롤백하지 않는다(CLAUDE.md: 남의 행에 쓰는 작업은 실패해도
	-- 본 작업을 막지 않고 로그만 남긴다).
	begin
		insert into public.notifications (recipient_id, type, payload)
		values (v_partner_id, 'payout_released', jsonb_build_object('partnerId', v_partner_id));
	exception when others then
		raise warning '[complete_partner_settlement] 알림 생성 실패: %', sqlerrm;
	end;

	return query select v_payout, v_fee;
end;
$$;

revoke execute on function public.complete_partner_settlement(uuid) from public, anon;
grant execute on function public.complete_partner_settlement(uuid) to authenticated;

-- update_payment_status는 이제 환불 전이만 담당한다(정산은 complete_partner_settlement 전담)
create or replace function public.update_payment_status(
	p_payment_id uuid,
	p_status public.payment_status
) returns void
language plpgsql security definer
set search_path = public
as $$
begin
	if not public.is_admin() then
		raise exception 'admin only';
	end if;
	if p_status <> 'refunded' then
		raise exception 'invalid transition — use complete_partner_settlement for release';
	end if;

	update public.payments set status = p_status where id = p_payment_id and status = 'paid';
	if not found then
		raise exception 'payment not in paid status';
	end if;
end;
$$;

-- payout_released도 partner_approved/rejected와 같은 이유로 dedup 제외: 이벤트별 고유
-- payload 키(bookingId)가 없고, complete_partner_settlement가 이미 status='paid' 가드로
-- 같은 결제의 중복 정산 자체를 막는다 (담당2 승인 완료).
drop index public.notifications_dedupe_idx;

create unique index notifications_dedupe_idx
	on public.notifications (type, (payload ->> 'bookingId'), recipient_id)
	where type not in ('partner_approved', 'partner_rejected', 'payout_released');
