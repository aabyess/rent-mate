-- supabase/migrations/20260819162612_chat_reads.sql
-- 채팅 안읽음 표시: 방별 마지막 읽은 시각. 안읽음 수 = last_read_at 이후 상대가 보낸 메시지 수

create table public.chat_reads (
	booking_id uuid not null references public.bookings (id) on delete restrict,
	reader_id uuid not null references public.profiles (id),
	last_read_at timestamptz not null default now(),
	primary key (booking_id, reader_id)
);

alter table public.chat_reads enable row level security;

create policy "chat_reads_select_own" on public.chat_reads
	for select using (reader_id = auth.uid());
create policy "chat_reads_insert_participant" on public.chat_reads
	for insert with check (
		reader_id = auth.uid()
		and exists (
			select 1 from public.bookings b
			where b.id = chat_reads.booking_id
				and (b.customer_id = auth.uid() or b.partner_id = auth.uid())
		)
	);
create policy "chat_reads_update_own" on public.chat_reads
	for update using (reader_id = auth.uid());
