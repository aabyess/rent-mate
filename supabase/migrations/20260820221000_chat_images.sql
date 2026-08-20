-- supabase/migrations/20260820221000_chat_images.sql
-- 채팅 이미지 전송. 대화 저장·삭제불가 의무(청소년보호법 기술적 안전조치)는 이미지에도
-- 동일 적용 — storage에도 delete 정책을 두지 않는다.

alter table public.chat_messages add column image_url text;

-- 이미지 전용 메시지는 content=''(not null 컬럼이라 빈 문자열, null 아님)로 들어온다.
alter table public.chat_messages drop constraint chat_messages_content_check;
alter table public.chat_messages add constraint chat_messages_content_check
	check (
		(length(content) between 1 and 2000)
		or (image_url is not null and length(content) <= 2000)
	);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('chat-images', 'chat-images', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- 경로 컨벤션 {bookingId}/{uuid}.{ext} — 첫 폴더를 예약 id로 매핑해 참여자만 업로드·조회 가능
create policy "chat_images_insert_participant" on storage.objects
	for insert with check (
		bucket_id = 'chat-images'
		and exists (
			select 1 from public.bookings b
			where b.id::text = (storage.foldername(name))[1]
				and (b.customer_id = auth.uid() or b.partner_id = auth.uid())
		)
	);

create policy "chat_images_select_participant_or_admin" on storage.objects
	for select using (
		bucket_id = 'chat-images'
		and (
			exists (
				select 1 from public.bookings b
				where b.id::text = (storage.foldername(name))[1]
					and (b.customer_id = auth.uid() or b.partner_id = auth.uid())
			)
			or public.is_admin()
		)
	);
