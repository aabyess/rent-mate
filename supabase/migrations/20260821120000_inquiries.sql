-- supabase/migrations/20260821120000_inquiries.sql
-- 고객센터 1:1 문의 접수 — 사용자가 문의를 남기고 admin이 답변한다.
-- 문의는 비공개 채널(본인+admin만)이라 금칙어 거부 대상이 아니다 (신고성 내용도 자유롭게).

create type public.inquiry_status as enum ('open', 'answered');

create table public.inquiries (
	id uuid primary key default gen_random_uuid(),
	profile_id uuid not null references public.profiles (id) on delete cascade,
	category text not null,
	content text not null check (length(content) between 1 and 1000),
	status public.inquiry_status not null default 'open',
	answer text,
	answered_at timestamptz,
	created_at timestamptz not null default now()
);

create index inquiries_profile_created_idx on public.inquiries (profile_id, created_at desc);
create index inquiries_status_idx on public.inquiries (status);

alter table public.inquiries enable row level security;

create policy "inquiries_select_own_or_admin" on public.inquiries
	for select using (profile_id = auth.uid() or public.is_admin());
create policy "inquiries_insert_own" on public.inquiries
	for insert with check (profile_id = auth.uid());
-- 답변·상태 변경은 admin만
create policy "inquiries_update_admin" on public.inquiries
	for update using (public.is_admin());
