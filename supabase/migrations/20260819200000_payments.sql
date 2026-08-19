-- supabase/migrations/20260819200000_payments.sql
-- 결제(에스크로) 스캐폴드. 결제 승인·상태 전이는 서버 전용 — 클라이언트 직접 쓰기 금지.

create type public.payment_status as enum ('pending', 'paid', 'refunded', 'released');

create table public.payments (
	id uuid primary key default gen_random_uuid(),
	booking_id uuid not null unique references public.bookings (id) on delete restrict,
	customer_id uuid not null references public.profiles (id),
	amount_krw integer not null check (amount_krw > 0),
	status public.payment_status not null default 'pending',
	provider text not null default 'toss',
	provider_payment_key text unique,
	approved_at timestamptz,
	created_at timestamptz not null default now()
);

create index payments_customer_id_idx on public.payments (customer_id);
create index payments_status_idx on public.payments (status);

alter table public.payments enable row level security;

create policy "payments_select_parties_or_admin" on public.payments
	for select using (
		customer_id = auth.uid()
		or exists (
			select 1 from public.bookings b
			where b.id = booking_id and b.partner_id = auth.uid()
		)
		or public.is_admin()
	);

-- insert/update/delete 정책 없음 + 전역 grant 회수: 결제 기록은 service_role 전용
revoke insert, update, delete on public.payments from anon, authenticated;

-- 토스 승인 후 결제 기록 (서버 라우트에서 admin 클라이언트로만 호출)
-- 금액·소유자를 DB에서 재검증해 위변조를 차단한다. bookings.status는 불변(파트너 수락 플로우 유지).
create function public.approve_booking_payment(
	p_booking_id uuid,
	p_customer_id uuid,
	p_provider_payment_key text,
	p_amount_krw integer
) returns void
language plpgsql security definer
set search_path = public
as $$
declare
	v_booking public.bookings%rowtype;
begin
	select * into v_booking from public.bookings where id = p_booking_id for update;
	if not found then
		raise exception 'booking not found';
	end if;
	if v_booking.customer_id <> p_customer_id then
		raise exception 'not booking owner';
	end if;
	if v_booking.total_amount_krw <> p_amount_krw then
		raise exception 'amount mismatch';
	end if;

	insert into public.payments
		(booking_id, customer_id, amount_krw, status, provider_payment_key, approved_at)
	values
		(p_booking_id, v_booking.customer_id, p_amount_krw, 'paid', p_provider_payment_key, now());
end;
$$;

revoke execute on function public.approve_booking_payment(uuid, uuid, text, integer)
	from public, anon, authenticated;

-- admin 수동 전이: paid → released(정산) / refunded(환불). 함수 내부에서 admin 검증.
create function public.update_payment_status(
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
	if p_status not in ('released', 'refunded') then
		raise exception 'invalid transition';
	end if;

	update public.payments set status = p_status where id = p_payment_id and status = 'paid';
	if not found then
		raise exception 'payment not in paid status';
	end if;
end;
$$;
