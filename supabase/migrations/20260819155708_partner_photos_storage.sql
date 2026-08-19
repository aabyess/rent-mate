-- supabase/migrations/20260819155708_partner_photos_storage.sql
-- 파트너 프로필 사진용 Storage 버킷: 공개 조회, 본인 폴더({uid}/...)에만 업로드·삭제

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
	'partner-photos',
	'partner-photos',
	true,
	5242880,
	array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "partner_photos_insert_own_folder" on storage.objects
	for insert with check (
		bucket_id = 'partner-photos'
		and (storage.foldername(name))[1] = auth.uid()::text
	);

create policy "partner_photos_delete_own_folder" on storage.objects
	for delete using (
		bucket_id = 'partner-photos'
		and (storage.foldername(name))[1] = auth.uid()::text
	);
