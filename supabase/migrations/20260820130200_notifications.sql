-- supabase/migrations/20260820130200_notifications.sql
-- 인앱 알림함 v1. 쓰기는 전부 서버(admin 클라이언트)에서만 — CLAUDE.md의
-- "남의 행에 쓰는 작업은 API 라우트에서 admin 클라이언트로" 규칙 그대로 적용.

create type public.notification_type as enum (
	'booking_requested',
	'booking_accepted',
	'booking_rejected',
	'booking_canceled',
	'review_received'
);

create table public.notifications (
	id uuid primary key default gen_random_uuid(),
	recipient_id uuid not null references public.profiles (id),
	type public.notification_type not null,
	payload jsonb not null default '{}',
	read_at timestamptz,
	created_at timestamptz not null default now()
);

create index notifications_recipient_created_idx on public.notifications (recipient_id, created_at desc);
create index notifications_recipient_unread_idx on public.notifications (recipient_id) where read_at is null;

-- 모든 타입이 예약당 1회성 이벤트라, 같은 (type, bookingId) 재요청은 중복 없이 흡수된다
-- (정당한 당사자의 반복 호출로 상대 알림함이 도배되는 것을 막는다)
create unique index notifications_dedupe_idx
	on public.notifications (type, (payload ->> 'bookingId'));

alter table public.notifications enable row level security;

create policy "notifications_select_own" on public.notifications
	for select using (recipient_id = auth.uid());

-- 읽음 처리(read_at)만 본인이 직접 할 수 있다 — 다른 컬럼은 아래 트리거가 막는다
create policy "notifications_update_own" on public.notifications
	for update using (recipient_id = auth.uid());

revoke insert, delete on public.notifications from anon, authenticated;

create function public.enforce_notification_read_only() returns trigger
language plpgsql
set search_path = public
as $$
begin
	if new.recipient_id is distinct from old.recipient_id
		or new.type is distinct from old.type
		or new.payload is distinct from old.payload
		or new.created_at is distinct from old.created_at then
		raise exception '읽음 처리(read_at)만 변경할 수 있습니다.';
	end if;
	return new;
end;
$$;

create trigger notifications_enforce_read_only
	before update on public.notifications
	for each row execute function public.enforce_notification_read_only();
